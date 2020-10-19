'use strict';

const express = require('express');
const multer = require('multer');
const router = express.Router();

const googleAdwordsEvaluationController = require('../controllers/adwords/googleAdwordsEvaluationController');
const googleAnalyticsEvaluationController = require('../controllers/analytics/googleAnalyticsEvaluationController');
const registerController = require('../controllers/register/registerController');
const wirecardController = require('../controllers/wirecard/wirecardController');
const sendgridController = require('../controllers/sendgrid/sendgridController');
const facebookEvaluationController = require('../controllers/facebook/facebookEvaluationController');
const requestsController = require('../controllers/flow/requestsController');
const leadsController = require('../controllers/flow/leadsController');
const banklyController = require('../controllers/bankly/banklyController');

router.post('/register', registerController.register);
router.post('/update', registerController.update);
router.post('/client/process', registerController.clientProcess);
router.post('/integration/campaigns/evaluation', registerController.adsEvaluation);
router.get('/uploads', registerController.uploads);
router.get('/email/available', registerController.emailIsAvailable);
router.post('/leads', leadsController.createLead);
router.post('/register/temporary', registerController.registerTemporary);
router.post('/google/campaigns/evaluation', googleAdwordsEvaluationController.googleAdwordsEvaluation);
router.post('/google/analytics/evaluation', googleAnalyticsEvaluationController.googleAnalyticsEvaluation);
router.get('/wirecard/url', wirecardController.getAuthorizeUrl);
router.get('/wirecard/transferurl', wirecardController.getAuthorizeTransferUrl);
router.get('/wirecard/check', wirecardController.checkIsWirecard);
router.get('/wirecard/balances', wirecardController.getBalances);
router.post('/wirecard/auth', wirecardController.generateToken);
router.post('/wirecard/auth/transfer', wirecardController.generateTokenTransfer);
router.post('/wirecard/statements', wirecardController.getStatements);
router.post('/wirecard/token', wirecardController.setNewToken);
router.post('/wirecard/transfer/wirecard', wirecardController.transferToWirecardAccount);
router.post('/wirecard/transfer/bank', wirecardController.transferToBankAccount);
router.post('/sendgrid/send/confirmation', sendgridController.sendConfirmationMail);
router.post('/sendgrid/send/notification', sendgridController.sendNotificationMail);
router.post('/sendgrid/send/abandonment', sendgridController.sendAbandonmentMail);
router.post('/sendgrid/send/datamissing', sendgridController.sendDataMissingMail);
router.post('/sendgrid/send/underanalysis', sendgridController.sendUnderAnalysisMail);
router.get('/facebook/campaigns/user', facebookEvaluationController.getUserAds);
router.post('/facebook/campaigns/evaluation', facebookEvaluationController.getFacebookInsights);
router.get('/flow/requests', requestsController.getRequests);
router.get('/bankly/cards/virtual', banklyController.createPaymentCard);

module.exports = router;