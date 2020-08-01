const wirecard = require('../../resources/wirecard');

const getAuthorizeUrl = async (request, response) => {
  try {
    const url = await wirecard.getAuthorizeUrl();

    return response.status(200).json({
      status: 'success',
      data: {
        url
      },
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

const getAccessToken = async (request, response) => {
  try {
    const {
      code
    } = request.body;

    if (!code) {
      return response.status(400).json({
        status: 'error',
        description: 'Código de autorização não informado.',
      });
    }

    const {
      access_token,
      refresh_token,
      expires_in,
    } = await wirecard.getAccessToken({
      code
    });

    return response.status(200).json({
      status: 'success',
      data: {
        access_token,
        refresh_token,
        expires_in,
      },
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

const getMovements = async (request, response) => {
  try {
    const {
      access_token
    } = request.body;

    if (!access_token) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de acesso não informado.',
      });
    }

    /* BLOCK STILL DEVELOPMENT START */

    const entries = await wirecard.getStatements({
      access_token,
      date: 'YYYY-MM-DD', // TO DO
    });

    /* BLOCK STILL DEVELOPMENT END */

    return response.status(200).json({
      status: 'success',
      data: entries,
    });

  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

module.exports = {
  getAuthorizeUrl,
  getAccessToken,
  getMovements,
}