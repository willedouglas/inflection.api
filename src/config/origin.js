'use strict';

const dotenv = require('./dotenv');

dotenv();

const whitelist = [
  'https://adfinance-register.a55.tech',
  'https://adfinance-register-staging.a55.tech',
  'https://localhost:8081',
  'https://plataforma.a55.local:8080',
  'https://plataforma.a55.tech',
  'https://plataforma-staging.a55.tech',
];

const origin = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS.'))
    }
  }
}

module.exports = origin;
