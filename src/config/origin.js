'use strict';

const dotenv = require('./dotenv');

dotenv();

const isStaging = process.env.ENV === 'staging';
const isProduction = process.env.ENV === 'production';

const origin = {
  origin: isProduction ? 'https://adfinance-register.a55.tech' : isStaging ? 'https://adfinance-register-staging.a55.tech' : 'https://localhost:8081',
};

module.exports = origin;
