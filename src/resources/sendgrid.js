const api = require('../helpers/api');

const apiHelper = api({
  baseURL: 'https://api.sendgrid.com/v3',
  headers: {
    Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
  },
});

module.exports = {
  send: body => apiHelper.post('/mail/send', body),
};