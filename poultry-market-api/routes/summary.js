const express = require('express');
const { summary } = require('../controllers/order');
const router = express.Router();

router.route('/').get(summary);

module.exports = router;
