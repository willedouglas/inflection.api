const dotenv = require('dotenv');
const api = require('../helpers/api');

dotenv.config();
const isProduction = process.env.ENV === 'production';
const baseURL = `${isProduction ? 'https://auth-api.a55.tech/api' : 'https://auth-api-staging.a55.tech/api'}`;

const apiHelper = ({
  token,
}) => api({
  baseURL,
  headers: {
    Authorization: token,
  },
});

module.exports = {
  getClearance: ({
    token,
    company_id,
  }) => apiHelper({
    token,
  }).post('/clearance', {
    clearance: `a55::midgard::client::${company_id}::read`,
  }),
};
