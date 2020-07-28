'use strict';

const dotenv = require('./dotenv');

dotenv();

const getOriginUrl = () => '*';

const origin = {
  origin: getOriginUrl(),
};

module.exports = origin;
