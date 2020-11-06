const express = require('express');
const bodyParser = require('body-parser');
const Sentry = require('@sentry/node');
const cors = require('cors');
const cron = require('node-cron');
const routes = require('./src/routes/index');

const jobs = require('./src/helpers/cronjobs');

const app = express();

Sentry.init({
  attachStacktrace: true,
  debug: true,
  environment: process.env.NODE_ENV,
  release: '0.0.1',
  dsn: 'https://8d50d40b277e468680a5be79081f7072@o290375.ingest.sentry.io/5493930',
});
app.use(Sentry.Handlers.requestHandler());
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      return error.status === 404 || error.status === 500;
    },
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

routes(app);

cron.schedule('30 0 * * *', async () => {
  await jobs.checkIncompleteRecords();
  await jobs.checkMissingBankAccounts();
  console.log(`SCHEDULED TASKS RUNNING ON: ${Date()}`);
});

module.exports = app;
