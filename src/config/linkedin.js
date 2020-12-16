const isProduction = process.env.NODE_ENV === 'production';

const PRODUCTION_REDIRECT_URI = 'https://inflection-web.herokuapp.com/auth/linkedin/callback';
const STAGING_REDIRECT_URI = 'http://localhost:8080/auth/linkedin/callback';

module.exports = {
  redirect_uri: isProduction ? PRODUCTION_REDIRECT_URI : STAGING_REDIRECT_URI,
  auth_uri: 'https://www.linkedin.com',
  api_uri: 'https://api.linkedin.com',
  client_secret: '10gENh92YmP7XCQj',
  client_id: '77hn4xyq2grtuf',
};
