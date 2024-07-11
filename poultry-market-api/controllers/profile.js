const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const getProfile = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new BadRequestError(`No user with id ${userId}`);
  }
  res.status(200).json({ user });
};

const updateProfile = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new BadRequestError(`No user with id ${userId}`);
  }
  res.status(200).json({ user });
};

module.exports = {
  getProfile,
  updateProfile,
};
