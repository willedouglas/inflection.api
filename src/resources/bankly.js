const dotenv = require('dotenv');
const Sentry = require('@sentry/node');
const api = require('../helpers/api');

dotenv.config();

const commonHeaders = {
  accept: 'application/json',
  'content-type': 'application/json',
  'api-version': process.env.BANKLY_API_VERSION,
};

const getAccessToken = async () => {
  const authServerUrl = process.env.BANKLY_AUTH_SERVER_URL;
  const apiHelper = api({
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.BANKLY_CLIENT_ID);
  params.append('client_secret', process.env.BANKLY_CLIENT_SECRET);

  const response = await apiHelper.post(authServerUrl, params);
  return response.data.access_token;
};

const cardsVirtual = async (token, payload) => {
  try {
    console.log('in cardsVirtual');
    console.log(process.env.BANKLY_SANDBOX_URL);
    const authorizationHeader = { authorization: `Bearer ${token}` };
    const apiBankly = api({
      baseURL: process.env.BANKLY_SANDBOX_URL,
      headers: {
        ...commonHeaders,
        ...authorizationHeader,
      },
    });
    return await apiBankly.post('cards/virtual', payload)
      .then((data) => (data))
      .catch((error) => {
        console.info(error);
        Sentry.captureException(error);
      });
  } catch (error) {
    console.info(error);
    Sentry.captureException(error);
    return error.response.data;
  }
};

const activateCard = async (token, payload, proxy) => {
  const authorizationHeader = { authorization: `Bearer ${token}` };
  const apiBankly = api({
    baseURL: process.env.BANKLY_SANDBOX_URL,
    headers: {
      ...commonHeaders,
      ...authorizationHeader,
    },
  });

  try {
    const result = await apiBankly.patch(`cards/${proxy}/activate`, payload);
    const { data } = result;
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const cardByProxy = async (token, proxy) => {
  const authorizationHeader = { authorization: `Bearer ${token}` };
  const apiBankly = api({
    baseURL: process.env.BANKLY_SANDBOX_URL,
    headers: {
      ...commonHeaders,
      ...authorizationHeader,
    },
  });

  try {
    const result = await apiBankly.get(`cards/${proxy}`);
    const { data } = result;
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const getPCIData = async (token, payload, proxy) => {
  const authorizationHeader = { authorization: `Bearer ${token}` };
  const apiBankly = api({
    baseURL: process.env.BANKLY_SANDBOX_URL,
    headers: {
      ...commonHeaders,
      ...authorizationHeader,
    },
  });

  try {
    const result = await apiBankly.post(`cards/${proxy}/pci`, payload);
    const { data } = result;
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const getTransactionsData = async (token, proxy) => {
  const authorizationHeader = { authorization: `Bearer ${token}` };
  const apiBankly = api({
    baseURL: process.env.BANKLY_SANDBOX_URL,
    headers: {
      ...commonHeaders,
      ...authorizationHeader,
    },
  });

  try {
    const result = await apiBankly.get(`cards/${proxy}/transactions`);
    const { data } = result;
    return data;
  } catch (error) {
    return error.response.data;
  }
};

module.exports = {
  cardsVirtual,
  activateCard,
  cardByProxy,
  getPCIData,
  getTransactionsData,
  getAccessToken,
};
