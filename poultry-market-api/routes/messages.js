const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messages');

const router = express.Router();

router.route('/').post(sendMessage);
router.route('/:id').get(getMessages);

module.exports = router;
