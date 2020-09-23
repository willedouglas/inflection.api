const api = require('../helpers/api');

const commonHeaders = { 
	"accept": "application/json",
	"content-type": "application/json",
	"api-version": process.env.BANKLY_API_VERSION
}

const cardsVirtual = async(token, payload) => {
	const authorizationHeader = {"authorization": `Bearer ${token}`} 
	const apiBankly = api({ 
		headers: {
			...commonHeaders,
			...authorizationHeader
		}
	})
	const result = await apiBankly.post(`${process.env.BANKLY_SANDBOX_URL}cards/virtual`, payload)
	return result
}

module.exports = {
    cardsVirtual,
}
