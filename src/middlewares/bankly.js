const Sentry = require('@sentry/node');
const dotenv = require('dotenv');
const api = require('../helpers/api');

dotenv.config();

const authentication = async (req, res, next) => {
  const apiHelper = api({
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.BANKLY_CLIENT_ID);
  params.append('client_secret', process.env.BANKLY_CLIENT_SECRET);

  try {
    const response = await apiHelper.post(
      process.env.BANKLY_AUTH_SERVER_URL, params,
    ).then((data) => data).catch();
    req.token = response.data.access_token.replace(/\r?\n|\r/g, '');
    return next();
  } catch (e) {
    Sentry.captureException(e);
    return res.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

module.exports = {
  authentication,
};
