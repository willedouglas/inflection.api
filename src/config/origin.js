const dotenv = require('./dotenv');

dotenv();

const whitelist = [
  'http://localhost:8080',
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
