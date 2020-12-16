const express = require('express');

const router = express.Router();

const linkedinController = require('../controllers/linkedin/linkedinController');

router.post('/linkedin/authorize', linkedinController.authorize);
router.post('/linkedin/profile', linkedinController.profile);

module.exports = router;
