'use strict';

const express = require('express');
const router = express.Router();

const googleAdwordsEvaluation = require('../controllers/adwords/googleAdwordsEvaluation');
const googleAnalyticsEvaluation = require('../controllers/analytics/googleAnalyticsEvaluation');
const register = require('../controllers/register/register');

const wirecard = require('../controllers/wirecard/wirecardController');

router.post('/register', register);
router.post('/google/campaigns/evaluation', googleAdwordsEvaluation);
router.post('/google/analytics/evaluation', googleAnalyticsEvaluation);

router.post('/wirecard/create/app', wirecard.create_app);
router.post('/wirecard/auth', wirecard.auth);
router.post('/wirecard/order', wirecard.order);
router.get('/wirecard/orders/all/:accessToken', wirecard.orders_all);
router.get('/wirecard/order/:orderid/:accessToken', wirecard.order_one);
router.post('/wirecard/payment', wirecard.payment);
router.get('/wirecard/saldo/:accessToken', wirecard.saldo);
router.get('/wirecard/extrato/liquidado/:begin/:end/:accessToken', wirecard.extrato_liquidado);
router.get('/wirecard/extrato/futuro/:begin/:end/:accessToken', wirecard.extrato_futuro);

module.exports = router;
