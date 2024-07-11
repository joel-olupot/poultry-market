const express = require('express');
const { status } = require('../controllers/order');
const router = express.Router();

router.route('/').get(status);

module.exports = router;
