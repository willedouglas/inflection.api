const api = require('../helpers/api');

const commonHeaders = {
	"accept": "application/json",
	"content-type": "application/json",
	"api-version": process.env.BANKLY_API_VERSION
}

const cardsVirtual = async(token, payload) => {
	const authorizationHeader = {"authorization": `Bearer ${token}`}
	const apiBankly = api({
    baseURL: process.env.BANKLY_SANDBOX_URL,
		headers: {
			...commonHeaders,
			...authorizationHeader
		}
	})

	try {
		const result = await apiBankly.post("cards/virtual", payload)
		let data = result.data
		return data
	} catch (error) {
		return error.response.data
	}
}

const activateCard = async(token, payload, proxy) => {
	const authorizationHeader = {"authorization": `Bearer ${token}`}
	const apiBankly = api({
    baseURL: process.env.BANKLY_SANDBOX_URL,
		headers: {
			...commonHeaders,
			...authorizationHeader
		}
	})

	try {
		const result = await apiBankly.patch(`cards/${proxy}/activate`, payload)
		let data = result.data
		return data
	} catch (error) {
		return error.response.data
	}
}

const cardByProxy = async(token, proxy) => {
	const authorizationHeader = {"authorization": `Bearer ${token}`}
	const apiBankly = api({
    baseURL: process.env.BANKLY_SANDBOX_URL,
		headers: {
			...commonHeaders,
			...authorizationHeader
		}
	})

	try {
		const result = await apiBankly.get(`cards/${proxy}`)
		let data = result.data
		return data
	} catch (error) {
		return error.response.data
	}
}

const getPCIData = async(token, payload, proxy) => {
	const authorizationHeader = {"authorization": `Bearer ${token}`}
	const apiBankly = api({
    baseURL: process.env.BANKLY_SANDBOX_URL,
		headers: {
			...commonHeaders,
			...authorizationHeader
		}
	})

	try {
		const result = await apiBankly.post(`cards/${proxy}/pci`, payload)
		let data = result.data
		return data
	} catch (error) {
		return error.response.data
	}
}

const getTransactionsData = async(token, proxy) => {
	const authorizationHeader = {"authorization": `Bearer ${token}`}
	const apiBankly = api({
    baseURL: process.env.BANKLY_SANDBOX_URL,
		headers: {
			...commonHeaders,
			...authorizationHeader
		}
	})

	try {
		const result = await apiBankly.get(`cards/${proxy}/transactions`)
		let data = result.data
		return data
	} catch (error) {
		return error.response.data
	}
}
module.exports = {
    cardsVirtual,
    activateCard,
    cardByProxy, 
    getPCIData,
    getTransactionsData,
}
