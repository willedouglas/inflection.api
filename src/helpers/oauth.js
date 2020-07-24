const { google } = require('googleapis');
const keys = require('../config/oauth2.keys');

const getAuthClient = () => {
  return new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris
  );
}

module.exports = {
  oauth: () => {
    return new Promise((resolve, reject) => {
      try {
        const auth = getAuthClient();
        google.options({ auth: auth });
        resolve(auth);
      } catch (e) {
        reject(e);
      }
    });
  },
  url: state => {
    return new Promise((resolve, reject) => {
      try {
        const auth = getAuthClient();
        const authUrl = auth.generateAuthUrl({
          access_type: 'offline',
          scope: ['https://www.googleapis.com/auth/adwords'],
          state,
        });

        resolve(authUrl);
      } catch (e) {
        reject(e);
      } 
    });
  },
}