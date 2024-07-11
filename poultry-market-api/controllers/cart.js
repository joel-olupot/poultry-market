const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const addToCart = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;

    const productData = {
      ...req.body,
      createdBy: req.body.createdBy,
    };

    const product = await Cart.create(productData);
    res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    console.log(error.message);
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

        return {
          ...item._doc,
          name: productDetails.name,
          description: productDetails.description,
          farmName: productDetails.farmName,
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
