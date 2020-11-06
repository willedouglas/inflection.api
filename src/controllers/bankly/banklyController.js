const Sentry = require('@sentry/node');

const {
  cardsVirtual, activateCard, cardByProxy, getPCIData, getTransactionsData,
} = require('../../resources/bankly');

exports.createPaymentCard = async (req, res) => {
  console.log('createPaymentCard');

  const payload = {
    ...req.body,
    ...{
      /*
      bankAgency: process.env.BANKLY_AGENCY,
      bankAccount: process.env.BANKLY_ACCOUNT,
      */
      programId: 82,
    },
  };
  console.log('calls cardsVirtual');
  console.log(req.token);
  console.log(payload);
  return cardsVirtual(req.token, payload)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.info(error);
      Sentry.captureException(error);
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
