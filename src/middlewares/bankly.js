const { URLSearchParams } = require('url');
const axios = require('axios');
const Sentry = require('@sentry/node');
const dotenv = require('dotenv');

dotenv.config();

const authentication = async (req, res, next) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const encodedParams = new URLSearchParams();
  encodedParams.set('grant_type', 'client_credentials');
  encodedParams.set('client_id', '5aacf84e-a854-42cd-9ab0-9e53100cd03e');
  encodedParams.set('client_secret', '7bfbd970-c0b1-49da-85e7-a6a29f76e4b1');

  const url = 'https://login.sandbox.bankly.com.br/connect/token';

  try {
    const response = await axios.post(
      url, encodedParams, { headers },
    ).then((data) => data).catch((error) => console.log(error));
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
