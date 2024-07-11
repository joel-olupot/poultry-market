const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profile');

const router = express.Router();

router.route('/').get(getProfile).put(updateProfile);

module.exports = router;
