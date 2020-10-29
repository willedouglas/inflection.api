const { validationResult } = require('express-validator');
const registerModel = require('../../models/register/register');

const {
  cardsVirtual, activateCard, cardByProxy, getPCIData, getTransactionsData,
} = require('../../resources/bankly');

exports.createPaymentCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const payload = {
    ...req.body,
    ...{
      programId: 82,
    },
  };

  return cardsVirtual(req.token, payload)
    .then(async (result) => {
      await registerModel.updateBanklyData({
        bankly_proxy: result.proxy,
        bankly_activation_code: result.activateCode,
        company_id: payload.documentNumber,
      });
      res.json(result);
    })
    .catch((error) => {
      res.json(error);
    });
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
