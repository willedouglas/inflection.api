const Sentry = require('@sentry/node');
const adwords = require('../../resources/googleAdwords');
const {
  handleGoogleErrors,
} = require('../../helpers/errors');
const {
  cleanString,
  removeSpaces,
} = require('../../helpers/format');
const {
  normalizeEvaluation,
} = require('./googleAdwordsEvaluationService');
const {
  startDate,
  endDate,
} = require('../../../constants');

const googleAdwordsEvaluation = async (request, response) => {
  try {
    const {
      access_token,
      customer_account_id,
    } = request.body;

    if (!access_token) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de acesso não encontrado.',
      });
    }

    if (!customer_account_id) {
      return response.status(400).json({
        status: 'error',
        description: 'Identificador da conta não encontrado.',
      });
    }

    const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      segments.date,
      metrics.clicks,
      metrics.impressions,
      metrics.ctr,
      metrics.cost_micros,
      metrics.average_cpc,
      metrics.absolute_top_impression_percentage,
      metrics.top_impression_percentage,
      metrics.conversions,
      metrics.view_through_conversions,
      metrics.cost_per_all_conversions,
      metrics.conversions_from_interactions_rate,
      metrics.average_cpm
    FROM
      campaign
    WHERE
      segments.date BETWEEN '${startDate}' AND '${endDate}'`;

    const evaluation = await adwords.searchStream({
      access_token,
      customer_account_id: cleanString(customer_account_id),
      query: removeSpaces(query),
    });

    return response.status(200).json({
      status: 'success',
      customer_account_id: cleanString(customer_account_id),
      data: normalizeEvaluation(evaluation),
    });
  } catch (e) {
    console.info(e);
    Sentry.captureException(e);
    const errorMessage = (e.response && e.response.data && e.response.data.error && e.response.data.error.status) || 'DEFAULT';

    return response.status(500).json({
      status: 'error',
      description: handleGoogleErrors(errorMessage),
    });
  }
};

module.exports = {
  googleAdwordsEvaluation,
};
