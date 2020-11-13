const Sentry = require('@sentry/node');
const facebookAds = require('../../resources/facebookAds');
const registerModel = require('../../models/register/register');
const {
  handleFacebookErrors,
} = require('../../helpers/errors');
const {
  normalizeInsights,
} = require('./facebookAdwordsEvaluationService');
const {
  cleanString,
} = require('../../helpers/format');

const fields = [
  'campaign_id',
  'campaign_name',
  'objective',
  'clicks',
  'impressions',
  'ctr',
  'cpc',
  'cpm',
  'reach',
  'full_view_impressions',
  'spend',
  'conversions',
  'conversion_values',
  'cost_per_conversion',
  'cost_per_action_type',
  'cost_per_unique_click',
  'cpp',
  'frequency',
];

const getUserAds = async (request, response) => {
  try {
    const {
      access_token,
    } = request.query;

    if (!access_token) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de acesso não informado.',
      });
    }

    const adAccounts = await facebookAds.getUser({
      access_token,
    });

    return response.status(200).json({
      status: 'success',
      data: adAccounts.data.adaccounts.data,
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

const getFacebookInsights = async (request, response) => {
  try {
    const {
      company_id,
      access_token,
      ad_account_id,
      is_save,
    } = request.body;

    if (!access_token) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de acesso não informado.',
      });
    }

    if (!ad_account_id) {
      return response.status(400).json({
        status: 'error',
        description: 'Identificador da conta não informado.',
      });
    }

    const insights = await facebookAds.getFaceInsights({
      access_token,
      ad_account_id,
      fields,
    });

    if (is_save) {
      const METHOD = 'FACEBOOK_ADS';

      if (!company_id) {
        return response.status(400).json({
          status: 'error',
          description: 'Identificador da empresa não encontrado.',
        });
      }

      await registerModel.adsEvaluation({
        company_id: cleanString(company_id),
        ads: {
          method: METHOD,
          access_token,
          customer_account_id: cleanString(ad_account_id),
          evaluation: normalizeInsights(insights.data.data),
        },
      });

      await registerModel.upload({
        company_id: cleanString(company_id),
        method: METHOD,
      });

      return response.status(200).json({
        status: 'success',
      });
    }

    return response.status(200).json({
      status: 'success',
      ad_account_id,
      data: normalizeInsights(insights.data.data),
    });
  } catch (e) {
    console.info(e);
    Sentry.captureException(e);
    const errorMessage = (e.response && e.response.data && e.response.data.error && e.response.data.error.code) || 'DEFAULT';

    return response.status(500).json({
      status: 'error',
      description: handleFacebookErrors(errorMessage),
    });
  }
};

module.exports = {
  getUserAds,
  getFacebookInsights,
};
