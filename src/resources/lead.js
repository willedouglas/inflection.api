const api = require('../helpers/api');

const isProduction = process.env.ENV === 'production';

const baseURL = `${ isProduction ? 'https://proposals-api.a55.tech' : 'https://proposals-api-staging.a55.tech' }`;

const apiHelper = api({
  baseURL,
});

module.exports = {
  createLead: ({ name, email, cnpj }) => apiHelper.post('/leads?sendMail=false', { name, email, cnpj }),
};