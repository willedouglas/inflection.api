/* eslint-disable import/order */

const api = require('../helpers/api');
const keys = require('../config/wirecard.keys');

const isProduction = process.env.ENV === 'production';
const baseURL = `${isProduction ? 'https://api.moip.com.br/v2' : 'https://sandbox.moip.com.br/v2'}`;

const moip = require('moip-sdk-node').default({
  accessToken: keys.accessToken,
  production: isProduction,
});

const moipTransfer = require('moip-sdk-node').default({
  accessToken: keys.accessTokenTransfer,
  production: isProduction,
});

const apiHelper = api({
  baseURL,
  headers: {
    Authorization: `OAuth ${keys.accessToken}`,
  },
});

const apiHelperSplitBalance = ({
  access_token,
}) => api({
  baseURL,
  headers: {
    Authorization: `OAuth ${access_token}`,
    Accept: 'application/json;version=2.1',
  },
});

module.exports = {
  getAuthorizeUrl: () => moip.connect.getAuthorizeUrl({
    clientId: keys.client_idTransfer,
    redirectUri: keys.redirectUri,
    scopes: keys.scopes,
  }),
  getAuthorizeTransferUrl: () => moipTransfer.connect.getAuthorizeUrl({
    clientId: keys.client_idTransfer,
    redirectUri: keys.redirectTransferUri,
    scopes: keys.scopes_transfer,
  }),
  generateToken: ({
    code,
  }) => moip.connect.generateToken({
    clientId: keys.client_idTransfer,
    redirectUri: keys.redirectUri,
    client_secret: keys.client_secretTransfer,
    grant_type: 'authorization_code',
    code,
  }),
  generateTokenTransfer: ({
    code,
  }) => moipTransfer.connect.generateToken({
    clientId: keys.client_idTransfer,
    redirectUri: keys.redirectTransferUri,
    client_secret: keys.client_secretTransfer,
    grant_type: 'authorization_code',
    code,
  }),
  getStatements: ({
    begin,
    end,
  }) => apiHelper.get(`/statements?begin=${begin}&end=${end}`),
  getBalance: ({
    access_token,
  }) => apiHelperSplitBalance({ access_token }).get('/balances'),
  transferToWirecardAccount: ({
    access_token,
    body,
  }) => apiHelperSplitBalance({ access_token }).post('/transfers', body),
  transferToBankAccount: ({
    amount,
    bankNumber,
    agencyNumber,
    agencyCheckNumber,
    accountNumber,
    accountCheckNumber,
    holder,
  }) => moip.transfer.create({
    amount,
    transferInstrument: {
      method: 'BANK_ACCOUNT',
      bankAccount: {
        type: 'CHECKING',
        bankNumber,
        agencyNumber,
        agencyCheckNumber,
        accountNumber,
        accountCheckNumber,
        holder,
      },
    },
  }),
};
