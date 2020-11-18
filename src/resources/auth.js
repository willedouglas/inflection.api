const Sentry = require('@sentry/node');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const getClearance = async ({
  token,
  company_id,
}) => {
  try {
    await axios.post(`${process.env.AUTH_API_URL}/api/clearance`, {
      clearance: `a55::midgard::client::${company_id}::read`,
    }, {
      headers: { Authorization: token },
    });
  } catch (e) {
    console.info(e);
    Sentry.captureException(e);
  }
};

module.exports = {
  getClearance,
};
