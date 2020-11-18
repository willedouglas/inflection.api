const Sentry = require('@sentry/node');
const registerModel = require('../../models/register/register');

const updateStatus = async (request, response) => {
  try {
    const { company_id } = request.params;
    const { ads_integration_status } = request.body;

    if (ads_integration_status === 'skipped' || ads_integration_status === 'integrated') {
      await registerModel.updateIntegrationStatus({ company_id, ads_integration_status });
      return response.status(200).json({
        description: `Status atualizado para ${ads_integration_status}`,
      });
    }
    return response.status(400).json({
      status: 'error',
      description: 'Status inválido',
    });
  } catch (e) {
    console.info(e);
    Sentry.captureException(e);
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

module.exports = {
  updateStatus,
};
