const express = require('express');

const router = express.Router();
const { authentication } = require('../middlewares/bankly');
const googleAdwordsEvaluationController = require('../controllers/adwords/googleAdwordsEvaluationController');
const facebookAdwordsEvaluationController = require('../controllers/adwords/facebookAdwordsEvaluationController');
const googleAnalyticsEvaluationController = require('../controllers/analytics/googleAnalyticsEvaluationController');
const registerController = require('../controllers/register/registerController');
const wirecardController = require('../controllers/wirecard/wirecardController');
const sendgridController = require('../controllers/sendgrid/sendgridController');
const requestsController = require('../controllers/flow/requestsController');
const leadsController = require('../controllers/flow/leadsController');
const banklyController = require('../controllers/bankly/banklyController');
const { ensureAuthenticated } = require('../middlewares/ensureAuthenticated');

router.post('/register', ensureAuthenticated, registerController.register);
router.post('/update', ensureAuthenticated, registerController.update);
router.post('/client/process', ensureAuthenticated, registerController.clientProcess);
router.get('/uploads', ensureAuthenticated, registerController.uploads);
router.get('/email/available', ensureAuthenticated, registerController.emailIsAvailable);
router.post('/leads', ensureAuthenticated, leadsController.createLead);
router.get('/flow/requests', ensureAuthenticated, requestsController.getRequests);
router.post('/register/temporary', ensureAuthenticated, registerController.registerTemporary);
/* GOOGLE | FACEBOOK INTEGRATIONS */
router.post('/google/campaigns/evaluation', ensureAuthenticated, googleAdwordsEvaluationController.googleAdwordsEvaluation);
router.post('/google/analytics/evaluation', ensureAuthenticated, googleAnalyticsEvaluationController.googleAnalyticsEvaluation);
router.get('/facebook/campaigns/user', ensureAuthenticated, facebookAdwordsEvaluationController.getUserAds);
router.post('/facebook/campaigns/evaluation', ensureAuthenticated, facebookAdwordsEvaluationController.getFacebookInsights);
/* WIRECARD */
router.get('/wirecard/url', ensureAuthenticated, wirecardController.getAuthorizeUrl);
router.get('/wirecard/transferurl', ensureAuthenticated, wirecardController.getAuthorizeTransferUrl);
router.get('/wirecard/check', ensureAuthenticated, wirecardController.checkIsWirecard);
router.get('/wirecard/balances', ensureAuthenticated, wirecardController.getBalances);
router.post('/wirecard/auth', ensureAuthenticated, wirecardController.generateToken);
router.post('/wirecard/auth/transfer', ensureAuthenticated, wirecardController.generateTokenTransfer);
router.post('/wirecard/statements', ensureAuthenticated, wirecardController.getStatements);
router.post('/wirecard/token', ensureAuthenticated, wirecardController.setNewToken);
router.post('/wirecard/token/readonly', ensureAuthenticated, wirecardController.setReadToken);
router.post('/wirecard/transfer/wirecard', ensureAuthenticated, wirecardController.transferToWirecardAccount);
router.post('/wirecard/transfer/bank', ensureAuthenticated, wirecardController.transferToBankAccount);
/* SENDGRID */
router.post('/sendgrid/send/confirmation', ensureAuthenticated, sendgridController.sendConfirmationMail);
router.post('/sendgrid/send/notification', ensureAuthenticated, sendgridController.sendNotificationMail);
router.post('/sendgrid/send/abandonment', ensureAuthenticated, sendgridController.sendAbandonmentMail);
router.post('/sendgrid/send/datamissing', ensureAuthenticated, sendgridController.sendDataMissingMail);
router.post('/sendgrid/send/underanalysis', ensureAuthenticated, sendgridController.sendUnderAnalysisMail);
/* BANKLY */
router.post('/bankly/cards/virtual', authentication, banklyController.createPaymentCard);
router.get('/bankly/cards/virtual/:company_id', authentication, banklyController.getCard);
router.post('/bankly/cards/:proxy/activate', authentication, banklyController.activatePaymentCard);
router.get('/bankly/cards/:proxy', authentication, banklyController.cardDetailsByProxy);
router.post('/bankly/cards/:proxy/pci', authentication, banklyController.pci);
router.get('/bankly/cards/:proxy/transactions', authentication, banklyController.getTransactions);

module.exports = router;
