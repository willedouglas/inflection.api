const Sentry = require('@sentry/node');
const requests = require('../../models/flow/requests');
const BanklyCard = require('../../models/bankly/cards');

const {
  cardsVirtual, activateCard, cardByProxy, getPCIData, getTransactionsData,
} = require('../../resources/bankly');

exports.createPaymentCard = async (req, res) => {
  try {
    console.log('createPaymentCard');
    const payload = {
      ...req.body,
      ...{
        programId: 82,
      },
    };

    const response = await cardsVirtual(req.token, payload)
      .then((result) => (result))
      .catch((error) => {
        res.json(error);
      });
    if (response.status === 202) {
      const account = await requests({ company_id: req.body.documentNumber });
      const banklyAccount = {
        account_id: account[0].id,
        proxy: response.data.proxy,
        activate_code: response.data.activateCode,
        account_number: payload.bankAccount,
      };
      await BanklyCard.insertVirtualCard(banklyAccount);
      return res.status(response.status).json(banklyAccount);
    }
    return res.status(response.status).json(response.data);
  } catch (e) {
    Sentry.captureException(e);
    return res.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

exports.activatePaymentCard = async (req, res) => {
  const payload = { ...req.body };
  const { proxy } = req.params;
  activateCard(req.token, payload, proxy)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json(error);
    });
};

exports.cardDetailsByProxy = async (req, res) => {
  const { proxy } = req.params;
  cardByProxy(req.token, proxy)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json(error);
    });
};

exports.pci = async (req, res) => {
  const payload = { ...req.body };
  const { proxy } = req.params;
  getPCIData(req.token, payload, proxy)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json(error);
    });
};

exports.getTransactions = async (req, res) => {
  const { proxy } = req.params;
  getTransactionsData(req.token, proxy)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json(error);
    });
};
