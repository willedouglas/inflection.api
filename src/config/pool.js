'use strict';

const {
  Pool
} = require('pg');
const dotenv = require('./dotenv');

dotenv();

/* eslint-disable-next-line */
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString,
});

module.exports = pool;