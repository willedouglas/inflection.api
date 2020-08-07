const facebookAds = require('../../resources/facebookAds');
const { normalizeEvaluation } = require('./facebookEvaluationService');

const getUserAds = async (request, response) => {
  try {
    const {
      access_token
    } = request.query;

    if (!access_token) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de acesso não informado.',
      });
    }

    const adaccounts = await facebookAds.getUser(
      access_token,
    );

    return response.status(200).json({
      status: 'success',
      data: adaccounts.data.adaccounts.data,
    });

  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

const getFacebookInsights = async (request, response) => {
  try {
    const {
      access_token,
      ad_account_id,
    } = request.query;

    if (!access_token) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de acesso não informado.',
      });
    }

    if (!ad_account_id) {
      return response.status(400).json({
        status: 'error',
        description: 'AD_ACCOUNT_ID de acesso não informado.',
      });
    }

    const insights = await facebookAds.getFaceInsights(
      access_token,
      ad_account_id
    );

    return response.status(200).json({
      status: 'success',
      customer_account_id: ad_account_id,
      data: normalizeEvaluation(insights),
    });

    /* return response.status(200).json({
      status: 'success',
      data: insights,
    }); */

  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

module.exports = {
  getUserAds,
  getFacebookInsights
}