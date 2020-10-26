const express = require('express');
const bodyParser = require('body-parser');
const Sentry = require('@sentry/node');
const cors = require('cors');
const cron = require('node-cron');
const origin = require('./src/config/origin');
const routes = require('./src/routes/index');

const jobs = require('./src/helpers/cronjobs');

const app = express();

Sentry.init({
  attachStacktrace: true,
  debug: true,
  environment: process.env.NODE_ENV,
  release: '0.0.1',
  dsn:
    process.env.NODE_ENV !== 'development'
      ? process.env.ADSFINANCE_SENTRY_DSN
      : process.env.ADSFINANCE_SENTRY_DSN,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(origin));

routes(app);

cron.schedule('30 0 * * *', async () => {
  await jobs.checkIncompleteRecords();
  await jobs.checkMissingBankAccounts();
  console.log(`SCHEDULED TASKS RUNNING ON: ${Date()}`);
});

module.exports = app;
