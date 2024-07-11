const express = require('express');
const {
  makeOrder,
  getAllOrders,
  updateOrder,
} = require('../controllers/order');
const router = express.Router();

router.route('/').post(makeOrder).get(getAllOrders);
router.route('/:id').patch(updateOrder);

module.exports = router;
