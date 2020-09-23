'use strict';

const express = require('express');
const origin = require('./src/config/origin');
const routes = require('./src/routes/index');
const cors = require('cors');

const cron = require('node-cron');
const jobs = require('./src/helpers/cronjobs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(origin));

routes(app);

cron.schedule('30 0 * * *', async () => {
  await jobs.checkIncompleteRecords();
  await jobs.checkMissingBankAccounts();
  console.log(`SCHEDULED TASKS RUNNING ON: ${Date()}`);
});

module.exports = app;
