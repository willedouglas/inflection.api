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

const isDev = process.env.ENV === 'development';
const isStaging = process.env.ENV === 'staging';

const origin = {
  origin: (url, callback) => {
    if (whitelist.indexOf(url) !== -1 || isDev || isStaging) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS.'));
    }
  },
};

module.exports = origin;
