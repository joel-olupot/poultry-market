const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    req.body.createdBy = userId;

    const existingCartItems = await Cart.find({ createdBy: userId });

    if (existingCartItems.length > 0) {
      const existingProductId = existingCartItems[0].productId;

      const existingProduct = await Product.findById(existingProductId);
      const existingFarmerId = existingProduct.createdBy.toString();

      const product = await Product.findById(req.body.productId);
      const farmerId = product.createdBy.toString();

      if (farmerId !== existingFarmerId) {
        return res.status(StatusCodes.OK).json({
          status: 'unsuccessful',
        });
      }
    }

    const productData = {
      ...req.body,
      createdBy: userId,
    };

    const newProduct = await Cart.create(productData);
    res.status(StatusCodes.CREATED).json({ product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;

    const cartItems = await Cart.find({ createdBy: req.user.userId }).sort(
      'createdAt'
    );

    const detailedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        const productDetails = await Product.findById(item.productId);
        const farmer = await User.findById(productDetails.createdBy);

        return {
          ...item._doc,
          name: productDetails.name,
          description: productDetails.description,
          farmName: farmer.farmName,
          images: productDetails.images,
        };
      })
    );

    res
      .status(StatusCodes.OK)
      .json({ products: detailedCartItems, count: detailedCartItems.length });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  const {
    user: { userId },
    params: { id: productId },
  } = req;
  const product = await Cart.findOneAndRemove({
    _id: productId,
    createdBy: userId,
  });
  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).send();
};

const deleteCart = async (req, res) => {
  const {
    user: { userId },
  } = req;
  await Cart.deleteMany({
    createdBy: userId,
  });

  res.status(StatusCodes.OK).send();
};

module.exports = {
  addToCart,
  getCart,
  deleteCartItem,
  deleteCart,
};
