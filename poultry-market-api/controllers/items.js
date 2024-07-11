const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllItems = async (req, res) => {
  const items = await Product.find({}).sort('-quantity.min');
  res.status(StatusCodes.OK).json({ items, count: items.length });
};

const getItem = async (req, res) => {
  const { id: itemId } = req.params;
  const item = await Product.findOne({ _id: itemId });
  if (!item) {
    throw new NotFoundError(`No item with id ${itemId}`);
  }
  res.status(StatusCodes.OK).json({ item });
};

module.exports = { getAllItems, getItem };
