const { cardsVirtual, activateCard, cardByProxy, getPCIData, getTransactionsData } = require('../../resources/bankly');
const { validationResult } = require('express-validator');


exports.createPaymentCard = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
	    return res.status(400).json({ errors: errors.array() });
    }

    const payload = { ...req.body, ...{ /*bankAgency: process.env.BANKLY_AGENCY, bankAccount: process.env.BANKLY_ACCOUNT, */programId: 82 }}
    const result = cardsVirtual(req.token, payload)
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        res.json(error)
      })
}

exports.activatePaymentCard = async (req, res) => {
    
    const payload = { ...req.body }
    const proxy = req.params.proxy
    const result = activateCard(req.token, payload, proxy)
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json(error) 
    })
}

exports.cardDetailsByProxy = async (req, res) => {
    
    const proxy = req.params.proxy
    const result = cardByProxy(req.token, proxy)
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json(error) 
    })
}

exports.pci = async (req, res) => {
    
    const payload = { ...req.body }
    const proxy = req.params.proxy
    const result = getPCIData(req.token, payload, proxy)
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json(error) 
    })
}

exports.getTransactions = async (req, res) => {
    
    const proxy = req.params.proxy
    const result = getTransactionsData(req.token, proxy)
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json(error) 
    })
}
