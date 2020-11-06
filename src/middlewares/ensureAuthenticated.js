const dotenv = require('dotenv');
const api = require('axios');

dotenv.config();
const isProduction = process.env.ENV === 'production';

// eslint-disable-next-line consistent-return
const ensureAuthenticated = async (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(403).json({ message: 'Token not informed' });
    }

    const [, token] = authHeader.split(' ');

    const headers = {
      Authorization: `Token ${token}`,
      'content-type': 'application/json',
    };

    const baseUrl = `${isProduction ? 'https://auth-api.a55.tech/api' : 'https://auth-api-staging.a55.tech/api'}`;
    const payload = '{"clearance":"a55::midgard::instrument::<cnpj>::read"}';

    const verifyToken = await api.post(
      `${baseUrl}/clearedIds`,
      payload,
      { headers },
    );

    if (verifyToken.data) {
      return next();
    }
  } catch (error) {
    return response.status(403).json(error.response.data);
  }
};

module.exports = {
  ensureAuthenticated,
};
