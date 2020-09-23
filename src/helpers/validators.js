const { body } = require('express-validator');

const createCreditCard = [
	body('documentNumber', 'Informar número de documento de CPF ou CNPJ').exists(),
	body('cardName', 'Informe nome que será impresso no cartão').exists(),
	body('alias', 'Informe apelido do cartão').exists(),
	body('password')
		.exists()
		.withMessage('Informe a senha do cartão')
		.isLength({ min: 4, max: 4 })
		.withMessage('Senha deve ter quatro campos número'),
	body('address.zipCode')
		.isLength({min: 8})
		.withMessage('Informe o CEP'),
	body('address.address', 'Informe o endereço').exists(),
	body('address.number', 'Informe o numero').exists(),
	body('address.neighborhood', 'Informe o bairro').exists(),
	body('address.city', 'Informe o cidade').exists(),
	body('address.state', 'Informe o estado').exists(),
	body('address.country', 'Informe o pais').exists(),	
]

module.exports = {
	createCreditCard,
}; 
