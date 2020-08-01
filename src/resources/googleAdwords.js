const api = require('../helpers/api');
const keys = require('../config/oauth2.keys');

const apiHelper = ({
  access_token
}) => api({
  baseURL: 'https://googleads.googleapis.com/v4/',
  headers: {
    Authorization: `Bearer ${access_token}`,
    'developer-token': keys.developer_token
  },
});

module.exports = {
  getCustomer: ({
    access_token,
    customer_account_id,
  }) => apiHelper({
    access_token
  }).get(`/customers/${customer_account_id}`),

  searchStream: ({
    access_token,
    customer_account_id,
    query,
  }) => apiHelper({
    access_token
  }).post(`/customers/${customer_account_id}/googleAds:search`, {
    query
  }),
};