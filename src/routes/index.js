const main = require('./main');

const routes = (app) => {
  app.use(main);
};

module.exports = routes;
