const api = require('../helpers/api');
const keys = require('../config/wirecard.keys');

const isProduction = process.env.ENV === 'production';
const baseURL = `${ isProduction ? 'https://moip.com.br/v2' : 'https://sandbox.moip.com.br/v2' }`;

const moip = require('moip-sdk-node').default({
  accessToken: keys.accessToken,
  production: isProduction
});

const apiHelper = api({
  baseURL,
  headers: {
    Authorization: `OAuth ${keys.accessToken}`
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
    begin,
    end,
  }) => apiHelper.get(`/statements?begin=${begin}&end=${end}`),
};
