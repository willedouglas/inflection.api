'use strict';

const dotenv = require('./dotenv');

dotenv();

const { FRONT_WEB_URL } = process.env;

const origin = {
  origin: FRONT_WEB_URL,
  credentials: true,
};

module.exports = origin;
