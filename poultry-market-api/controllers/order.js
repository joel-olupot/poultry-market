const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const makeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { products, deposit, totalCost } = req.body;

    const balance = totalCost - deposit;

    const orderItems = await Promise.all(
      products.map(async (product) => {
        const productData = await Product.findById(product.productId);
        const { name, createdBy } = productData;

        return {
          ...product,
          productName: name,
          farmerId: createdBy,
        };
      })
    );

    const orderData = {
      madeBy: userId,
      totalCost,
      deposit,
      balance,
      items: orderItems,
    };

    const order = await Order.create(orderData);
    res.status(StatusCodes.CREATED).json({ order });
  } catch (error) {
    console.log(error.message);
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    // Fetch orders that belong to the farmer
    const orders = await Order.find({
      'items.farmerId': req.user.userId,
    });

    // Prepare detailed orders with consumer information
    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const consumer = await User.findById(order.madeBy);

        return {
          ...order._doc, // Spread the order document to avoid Mongoose document issues
          contact: consumer.contact,
          email: consumer.email,
          consumerName: consumer.name,
        };
      })
    );

    res
      .status(StatusCodes.OK)
      .json({ detailedOrders, count: detailedOrders.length });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ madeBy: req.user.userId });

    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const detailedItems = await Promise.all(
          order.items.map(async (item) => {
            const farmer = await User.findById(item.farmerId);
            const productDetails = await Product.findById(item.productId);

            return {
              ...item._doc,
              farmerName: farmer.name,
              contact: farmer.contact,
              description: productDetails.description,
              farmName: farmer.farmName,
              images: productDetails.images,
            };
          })
        );

        return {
          ...order._doc,
          items: detailedItems,
        };
      })
    );

    res
      .status(StatusCodes.OK)
      .json({ detailedOrders, count: detailedOrders.length });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  const {
    user: { userId },
    params: { id: orderId },
  } = req;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, 'items.farmerId': userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!order) {
    throw new NotFoundError(`No product with id ${orderId}`);
  }
  res.status(StatusCodes.OK).json({ order });
};

const summary = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get current date and convert to UTC
    const now = new Date();
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);
    const last7Days = new Date(today);
    last7Days.setUTCDate(today.getUTCDate() - 7);

    const ordersToday = await Order.countDocuments({
      'items.farmerId': userId,
      createdAt: { $gte: today },
    });

    const ordersYesterday = await Order.countDocuments({
      'items.farmerId': userId,
      createdAt: {
        $gte: yesterday,
        $lt: today,
      },
    });

    const ordersLast7Days = await Order.countDocuments({
      'items.farmerId': userId,
      createdAt: { $gte: last7Days },
    });

    res.json({ ordersToday, ordersYesterday, ordersLast7Days });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order summary', error });
  }
};

const sales = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 6);

    const salesData = await Order.aggregate([
      { $unwind: '$items' },
      {
        $match: {
          'items.farmerId': mongoose.Types.ObjectId(userId),
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfYear: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          totalSales: { $sum: '$items.price' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.day': 1 },
      },
    ]);

    // Prepare an array to hold the sales data for the last 7 days
    const formattedSalesData = Array(7).fill(0);

    // Map the sales data to the formatted array
    salesData.forEach((sale) => {
      const saleDate = new Date(sale._id.year, 0); // Start of the sale year
      saleDate.setDate(sale._id.day); // Set the day of the year

      const dayIndex = Math.floor((today - saleDate) / (24 * 60 * 60 * 1000));
      if (dayIndex >= 0 && dayIndex < 7) {
        formattedSalesData[6 - dayIndex] = sale.totalSales;
      }
    });

    // console.log('Formatted Sales Data:', formattedSalesData); // Debug log
    res.json({ salesData: formattedSalesData });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Error fetching sales data', error });
  }
};

module.exports = sales;

const status = async (req, res) => {
  try {
    const userId = req.user.userId;

    const rawOrders = await Order.find({ 'items.farmerId': userId });

    if (rawOrders.length === 0) {
      return res.json({
        statusData: { pending: 0, completed: 0, rejected: 0 },
      });
    }

    const orders = await Order.aggregate([
      { $unwind: '$items' },
      {
        $match: { 'items.farmerId': mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusData = {
      pending: 0,
      completed: 0,
      rejected: 0,
    };

    orders.forEach((order) => {
      statusData[order._id] = order.count;
    });

    res.json({ statusData });
  } catch (error) {
    console.error('Error fetching order status data:', error); // Log the error to debug
    res
      .status(500)
      .json({ message: 'Error fetching order status data', error });
  }
};

module.exports = {
  makeOrder,
  getOrders,
  getOrderHistory,
  updateOrder,
  summary,
  sales,
  status,
};
