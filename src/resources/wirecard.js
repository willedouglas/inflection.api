const api = require('../helpers/api');
const keys = require('../config/wirecard.keys');

const isProduction = process.env.NODE_ENV === 'production';
const baseURL = `${ isProduction ? 'https://moip.com.br/v2' : 'https://sandbox.moip.com.br/v2' }`;

const moip = require('moip-sdk-node').default({
  accessToken: keys.accessToken,
  production: isProduction
});

const apiHelper = ({
  access_token
}) => api({
  baseURL,
  headers: {
    Accept: 'application/json;version=2.1',
    Authorization: `OAuth ${access_token}`
  },
});

module.exports = {
  getAuthorizeUrl: () => moip.connect.getAuthorizeUrl({
    clientId: keys.client_id,
    redirectUri: keys.redirectUri,
    scopes: keys.scopes,
  }),
  generateToken: ({
    code
  }) => moip.connect.generateToken({
    clientId: keys.client_id,
    redirectUri: keys.redirectUri,
    client_secret: keys.client_secret,
    grant_type: 'authorization_code',
    code,
  }),
  getStatements: ({
    access_token,
    date,
  }) => apiHelper({
    access_token
  }).get(`/statements/details?date=${date}`),
};