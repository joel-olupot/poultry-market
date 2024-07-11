const express = require('express');
const {
  addToCart,
  getCart,
  deleteCartItem,
  deleteCart,
} = require('../controllers/cart');

const router = express.Router();

router.route('/').post(addToCart).get(getCart).delete(deleteCart);
router.route('/:id').delete(deleteCartItem);

module.exports = router;
