const express = require('express');
const { sales } = require('../controllers/order');
const router = express.Router();

router.route('/').get(sales);

module.exports = router;
