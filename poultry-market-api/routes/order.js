const express = require('express');
const {
  makeOrder,
  getOrders,
  updateOrder,
  getOrderHistory,
} = require('../controllers/order');
const router = express.Router();

router.route('/').post(makeOrder).get(getOrders);
router.route('/history').get(getOrderHistory);
router.route('/:id').patch(updateOrder);

module.exports = router;
