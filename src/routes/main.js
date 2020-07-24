'use strict';

const express = require('express');
const router = express.Router();

const googleAdwordsEvaluation = require('../controllers/adwords/googleAdwordsEvaluation');
const googleAnalyticsEvaluation = require('../controllers/analytics/googleAnalyticsEvaluation');
const register = require('../controllers/register/register');

router.post('/register', register);
router.post('/google/campaigns/evaluation', googleAdwordsEvaluation);
router.post('/google/analytics/evaluation', googleAnalyticsEvaluation);

module.exports = router;
