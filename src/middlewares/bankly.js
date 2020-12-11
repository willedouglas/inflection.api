const { URLSearchParams } = require('url');
const axios = require('axios');
const Sentry = require('@sentry/node');
const dotenv = require('dotenv');

dotenv.config();

const authentication = async (req, res, next) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.BANKLY_CLIENT_ID);
  params.append('client_secret', process.env.BANKLY_CLIENT_SECRET);

  try {
    const response = await axios.post(`${process.env.BANKLY_AUTH_SERVER_URL}/connect/token`, params, { headers });
    req.token = response.data.access_token.replace(/\r?\n|\r/g, '');
    return next();
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      status: 'error',
      description: error.message,
    });
  }
};

module.exports = {
  authentication,
};
