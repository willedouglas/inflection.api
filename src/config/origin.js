'use strict';

const dotenv = require('./dotenv');

dotenv();

const getOriginUrl = () => {
  let originUrl = 'http://localhost:8081';

  const isProduction = process.env.NODE_ENV === 'production';
  const isStaging = process.env.NODE_ENV === 'staging';

  if (isProduction) {
    originUrl = 'https://adfinance-register.a55.tech';
  }

  if (isStaging) {
    originUrl = 'https://adfinance-register-staging.a55.tech';
  }

  console.log(originUrl, process.env.NODE_ENV);
  return originUrl;
}

const origin = {
  origin: getOriginUrl(),
};

module.exports = origin;
