const { cardsVirtual, activateCard } = require('../../resources/bankly');
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
