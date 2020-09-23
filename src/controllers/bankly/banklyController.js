const { cardsVirtual } = require('../../resources/bankly');
const { validationResult } = require('express-validator');


exports.createPaymentCard = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
	    return res.status(400).json({ errors: errors.array() });
    }
    const payload = { ...req.body, ...{ bankAgency: process.env.BANKLY_AGENCY, bankAccount: process.env.BANKLY_ACCOUNT} }
    cardsVirtual(req.token, payload)
    .then(result => {console.log(result)})
    .catch(err => { console.log(err)})
    res.send(req.token);
}
