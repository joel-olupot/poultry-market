const Product = require('../models/Product');
const User = require('../models/User');
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

const updateProduct = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: productId },
  } = req;
  if (company === ' ' || position === ' ') {
    throw new BadRequestError('Company or Position fields cannot be empty');
  }
  const product = await Product.findOneAndUpdate(
    { _id: productId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
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
  res.status(StatusCodes.OK).send();
};

const deleteAllProducts = async (req, res) => {
  const {
    user: { userId },
  } = req;
  const product = await Product.deleteMany({
    createdBy: userId,
  });

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
};
