const mongoose = require('mongoose');
const User = require('./User');

// Define the subdocument schemas for quantity and price
const quantitySchema = new mongoose.Schema(
  {
    min: {
      type: Number,
      required: true,
      min: 1,
    },
    max: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v >= this.min;
        },
        message: 'Max quantity must be greater than or equal to min quantity',
      },
    },
  },
  { _id: false }
);

const priceSchema = new mongoose.Schema(
  {
    min: {
      type: Number,
      required: true,
      min: 0,
    },
    max: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v >= this.min;
        },
        message: 'Max price must be greater than or equal to min price',
      },
    },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    data: Buffer,
    contentType: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: quantitySchema,
      required: true,
    },
    price: {
      type: priceSchema,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [imageSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
