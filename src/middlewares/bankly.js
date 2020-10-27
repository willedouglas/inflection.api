const api = require('../helpers/api');

const authentication = async (req, res, next) => {
  const authServerUrl = process.env.BANKLY_AUTH_SERVER_URL;
  const apiHelper = api({
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.BANKLY_CLIENT_ID);
  params.append('client_secret', process.env.BANKLY_CLIENT_SECRET);

  const response = await apiHelper.post(authServerUrl, params);
  req.token = response.data.access_token.replace(/\r?\n|\r/g, '');
  next();
};

module.exports = {
  authentication,
};
