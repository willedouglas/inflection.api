const api = require('axios');

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

    const payload = '{"clearance":"a55::midgard::instrument::<cnpj>::read"}';

    const verifyToken = await api.post(
      `${process.env.AUTH_API_URL}/clearedIds`,
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
