'use strict';

const express = require('express');
const router = express.Router();

const googleAdwordsEvaluationController = require('../controllers/adwords/googleAdwordsEvaluationController');
const googleAnalyticsEvaluationController = require('../controllers/analytics/googleAnalyticsEvaluationController');
const registerController = require('../controllers/register/registerController');
const wirecardController = require('../controllers/wirecard/wirecardController');
const sendgridController = require('../controllers/sendgrid/sendgridController');
const facebookEvaluationController = require('../controllers/facebook/facebookEvaluationController');

router.post('/register', registerController.register);
router.post('/google/campaigns/evaluation', googleAdwordsEvaluationController.googleAdwordsEvaluation);
router.post('/google/analytics/evaluation', googleAnalyticsEvaluationController.googleAnalyticsEvaluation);
router.get('/wirecard/url', wirecardController.getAuthorizeUrl);
router.post('/wirecard/auth', wirecardController.generateToken);
router.post('/wirecard/statements', wirecardController.getStatements);
router.post('/sendgrid/send/confirmation', sendgridController.sendConfirmationMail);
router.get('/facebook/ads/user', facebookEvaluationController.getUserAds);
router.get('/facebook/ads/evaluation', facebookEvaluationController.getFacebookInsights);

module.exports = router;