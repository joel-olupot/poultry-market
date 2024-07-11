const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const makeOrder = async (req, res) => {
  try {
    req.body.madeBy = req.user.userId;

    const itemData = {
      ...req.body,
    };

    const item = await Order.create(itemData);
    res.status(StatusCodes.CREATED).json({ item });
  } catch (error) {
    console.log(error.message);
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  const detailedOrders = await Promise.all(
    orders.map(async (order) => {
      const productDetails = await Product.findById(order.productId);

      return {
        ...order._doc,
        name: productDetails.name,
        description: productDetails.description,
        farmName: productDetails.farmName,
        images: productDetails.images,
      };
    })
  );
  res
    .status(StatusCodes.OK)
    .json({ detailedOrders, count: detailedOrders.length });
};
const updateOrder = async (req, res) => {
  const {
    params: { id: orderId },
  } = req;

  const order = await Order.findOneAndUpdate({ _id: orderId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    throw new NotFoundError(`No product with id ${orderId}`);
  }
  res.status(StatusCodes.OK).json({ order });
};

const summary = async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);

    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: today.setHours(0, 0, 0, 0) },
    });
    const ordersYesterday = await Order.countDocuments({
      createdAt: {
        $gte: yesterday.setHours(0, 0, 0, 0),
        $lt: today.setHours(0, 0, 0, 0),
      },
    });
    const ordersLast7Days = await Order.countDocuments({
      createdAt: { $gte: last7Days.setHours(0, 0, 0, 0) },
    });

    res.json({ ordersToday, ordersYesterday, ordersLast7Days });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order summary', error });
  }
};

const sales = async (req, res) => {
  try {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 6);

    const salesData = await Order.aggregate([
      {
        $match: { createdAt: { $gte: last7Days } },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          totalSales: { $sum: '$price' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formattedSalesData = Array(7).fill(0);
    salesData.forEach((sale) => {
      // Adjust dayIndex to match the days of the week and make today the last column
      const dayIndex = (sale._id - 2 - today.getDay() + 7) % 7;
      formattedSalesData[dayIndex] = sale.totalSales;
    });

    console.log('Formatted Sales Data:', formattedSalesData); // Debug log
    res.json({ salesData: formattedSalesData });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Error fetching sales data', error });
  }
};

const status = async (req, res) => {
  try {
    const orders = await Order.aggregate([
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
    res
      .status(500)
      .json({ message: 'Error fetching order status data', error });
  }
};
module.exports = {
  makeOrder,
  getAllOrders,
  updateOrder,
  summary,
  sales,
  status,
};
