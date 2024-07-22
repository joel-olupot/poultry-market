const Product = require('../models/Product');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { FileEarmarkBinary } = require('react-bootstrap-icons');

const getAllItems = async (req, res) => {
  const products = await Product.find({}).sort('-quantity.min');

  const items = await Promise.all(
    products.map(async (product) => {
      const farmer = await User.findById(product.createdBy);

      return {
        ...product._doc,
        farmName: farmer.farmName,
      };
    })
  );
  res.status(StatusCodes.OK).json({ items, count: items.length });
};

const getItem = async (req, res) => {
  const { id: itemId } = req.params;
  let product = await Product.findOne({ _id: itemId });
  const farmer = await User.findById(product.createdBy);

  const item = {
    ...product._doc,
    farmName: farmer.farmName,
  };

  if (!item) {
    throw new NotFoundError(`No item with id ${itemId}`);
  }
  res.status(StatusCodes.OK).json({ item });
};

module.exports = { getAllItems, getItem };
