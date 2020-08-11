const api = require('../helpers/api');
const keys = require('../config/oauth2.keys');

const apiHelper = () => api({
  baseURL: 'https://graph.facebook.com/v8.0/',
  headers: {},
});

const bizSdk = require('facebook-nodejs-business-sdk');
const AdAccount = bizSdk.AdAccount;
//const AdsInsights = bizSdk.AdsInsights;

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

/* levels: account, campaign, adset, ad */

const params = {
  'time_range' : {'since':'2017-01-01','until':'2021-01-01'},
  'filtering' : [],
  'level' : 'ad',
  'breakdowns' : [],
};

module.exports = {
  getUser: (access_token) => apiHelper().get(`me?fields=adaccounts&access_token=${access_token}`),

  getFaceInsights: (access_token, ad_account_id) => {
    const api = bizSdk.FacebookAdsApi.init(access_token);
    const account = new AdAccount(ad_account_id);

    return (new AdAccount(ad_account_id)).getInsights(
      fields,
      params
    );
    
  }



};
