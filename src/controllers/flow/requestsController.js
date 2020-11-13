const Sentry = require('@sentry/node');
const authResource = require('../../resources/auth');
const requests = require('../../models/flow/requests');

const {
  cleanString,
} = require('../../helpers/format');

const getRequests = async (request, response) => {
  try {
    const token = request.headers.authorization;
    let {
      company_id,
    } = request.query;

    company_id = cleanString(company_id);

    if (!token) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de autorização não encontrado.',
      });
    }

    if (!company_id) {
      return response.status(400).json({
        status: 'error',
        description: 'Empresa não informada.',
      });
    }

    await authResource.getClearance({ token, company_id });

    const searchedRequests = await requests({
      company_id,
    });

    return response.status(200).json({
      status: 'success',
      data: searchedRequests,
    });
  } catch (e) {
    Sentry.captureException(e);
    const errorMessage = (e.response && e.response.data && e.response.data.detail) || 'Erro desconhecido, aguarde uns instantes e tente novamente.';
    return response.status(500).json({
      status: 'error',
      description: errorMessage,
    });
  }
};

module.exports = {
  getRequests,
};
