const express = require('express');
const { getAllItems, getItem } = require('../controllers/items');

const router = express.Router();

router.route('/').get(getAllItems);
router.route('/:id').get(getItem);

module.exports = router;
