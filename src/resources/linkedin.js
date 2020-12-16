const api = require('../helpers/api');
const keys = require('../config/linkedin');

const {
  api_uri,
  auth_uri,
  redirect_uri,
  client_secret,
  client_id,
} = keys;

const apiAuthHelper = api({
  baseURL: `${auth_uri}`,
  headers: {
    'Content-Type': 'x-www-form-urlencoded',
  },
});

const apiHelper = (accessToken) => api({
  baseURL: `${api_uri}`,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

module.exports = {
  authorize(code) {
    return apiAuthHelper.post(`/oauth/v2/accessToken?grant_type=authorization_code&redirect_uri=${redirect_uri}&client_id=${client_id}&client_secret=${client_secret}&code=${code}`);
  },
  profile(accessToken) {
    return apiHelper(accessToken).get('v2/me?projection=(localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))');
  },
};
