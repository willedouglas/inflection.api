const wirecard = require('../../resources/wirecard');
const { begin, end } = require('../../../constants');
const { normalizeStatements } = require('./wirecardService');

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

const generateToken = async (request, response) => {
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

    const { body } = await wirecard.generateToken({ code });

    const {
      access_token,
      refresh_token,
      expires_in,
    } = JSON.parse(body);

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

const getStatements = async (request, response) => {
  try {
    const { data: statements } = await wirecard.getStatements({
      begin,
      end,
    });

    return response.status(200).json({
      status: 'success',
      data: normalizeStatements(statements),
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
  generateToken,
  getStatements,
}