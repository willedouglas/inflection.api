'use strict';

const analytics = require('../../resources/googleAnalytics');
const { handleGoogleErrors } = require('../../helpers/errors');
const { normalizeEvaluation } = require('./googleAnalyticsEvaluationService');

const googleAnalyticsEvaluation = async (request, response) => {
  try {
    const {
      access_token,
      view_id,
    } = request.body;

    if (!access_token) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de acesso não encontrado.'
      });
    }

    if (!view_id) {
      return response.status(400).json({
        status: 'error',
        description: 'Identificador do cliente não encontrado.'
      });
    }

    const metrics = ['ga:goalValueAll', 'ga:goalCompletionsAll', 'ga:goalConversionRateAll'];
    const dimensions = ['ga:date', 'ga:channelGrouping'];

    const evaluation = await analytics.getReport({
      access_token,
      view_id,
      metrics,
      dimensions,
    });

    return response.status(200).json({
      status: 'success',
      view_id,
      data: normalizeEvaluation(evaluation),
    });
  } catch (e) {
    const errorMessage = (e.response && e.response.data && e.response.data.error && e.response.data.error.status) || 'DEFAULT';

    return response.status(500).json({
      status: 'error',
      description: handleGoogleErrors(errorMessage),
    });
  };
};

module.exports = googleAnalyticsEvaluation;
