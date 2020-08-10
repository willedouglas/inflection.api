'use strict';

const express = require('express');
const routes = require('./src/routes/index');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

routes(app);

module.exports = app;
