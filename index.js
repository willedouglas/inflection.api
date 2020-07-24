'use strict';

const app = require('./server');

const PORT = process.env.PORT || 3333;

const infoMessage = '==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.';

app.listen(PORT, () => console.info(infoMessage, PORT, PORT));
