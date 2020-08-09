const axios = require('axios');

const api = options => axios.create({
  ...options,
  headers: {
    'Content-Type': 'application/json',
    ...options.headers,
  },
});

module.exports = api;