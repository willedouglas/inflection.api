'use strict';

const express = require('express');
const router = express.Router();

const main = require('./main');

const routes = app => {
  app.use(main);
};

module.exports = routes;