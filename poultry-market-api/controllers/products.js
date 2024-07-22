const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user.userId }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getProduct = async (req, res) => {
  const {
    user: { userId },
    params: { id: productId },
  } = req;
  const product = await Product.findOne({ _id: productId, createdBy: userId });
  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const createProduct = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;

    const {
      productName,
      quantityMin,
      quantityMax,
      priceMin,
      priceMax,
      description,
    } = req.body;
    const productData = {
      name: productName,
      quantity: { min: quantityMin, max: quantityMax },
      price: { min: priceMin, max: priceMax },
      description,
      createdBy: req.body.createdBy,
    };

    if (req.files) {
      const images = req.files.map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
      }));
      productData.images = images;
    }
    const user = await User.findOne({ _id: req.user.userId });
    productData.farmName = user.farmName;

    const product = await Product.create(productData);
    res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    console.log(error.message);
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const {
      user: { userId },
      params: { id: productId },
    } = req;

    const product = await Product.findOneAndRemove({
      _id: productId,
      createdBy: userId,
    });

    if (!product) {
      throw new NotFoundError(`No product with id ${productId}`);
    }

    await Cart.findOneAndRemove({ productId });

    const orders = await Order.find({});
    await Promise.all(
      orders.map(async (order) => {
        order.items = order.items.filter(
          (item) => !item.productId.equals(productId)
        );

        if (order.items.length === 0) {
          await Order.findByIdAndRemove(order._id);
        } else {
          await order.save();
        }
      })
    );

    res.status(StatusCodes.OK).send();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteAllProducts = async (req, res) => {
  try {
    const {
      user: { userId },
    } = req;

    const products = await Product.find({ createdBy: userId });

    await Promise.all(
      products.map(async (product) => {
        await Cart.findOneAndRemove({ productId: product._id });
      })
    );

    const orders = await Order.find({});
    await Promise.all(
      orders.map(async (order) => {
        order.items = order.items.filter(
          (item) =>
            !products.some((product) => product._id.equals(item.productId))
        );

        if (order.items.length === 0) {
          await Order.findByIdAndRemove(order._id);
        } else {
          await order.save();
        }
      })
    );

    await Product.deleteMany({ createdBy: userId });

    res.status(StatusCodes.OK).send();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  deleteAllProducts,
};
