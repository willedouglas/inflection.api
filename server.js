'use strict';

const express = require('express');
const origin = require('./src/config/origin');
const routes = require('./src/routes/index');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(origin));

routes(app);

module.exports = app;
