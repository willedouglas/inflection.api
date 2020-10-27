const api = require('../helpers/api');

const apiHelper = api({
  baseURL: 'https://graph.facebook.com/v8.0',
  headers: {},
});

module.exports = {
  getUser: ({ access_token }) => apiHelper.get(`/me?fields=adaccounts&access_token=${access_token}`),
  getFaceInsights: ({ access_token, ad_account_id, fields }) => {
    const normalizedFields = fields.join(',');
    return apiHelper.get(`/act_${ad_account_id}/insights?access_token=${access_token}&fields=${normalizedFields}&level=ad`);
  },
};
