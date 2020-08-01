const api = require('../helpers/api');
const {
  startDate,
  endDate
} = require('../../constants');

const apiHelper = ({
  access_token
}) => api({
  baseURL: 'https://analyticsreporting.googleapis.com/v4',
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
});

module.exports = {
  getReport: ({
    access_token,
    view_id,
    dimensions,
    metrics,
  }) => apiHelper({
    access_token
  }).post(`/reports:batchGet`, {
    reportRequests: [{
      viewId: view_id,
      dateRanges: [{
        startDate,
        endDate,
      }, ],
      metrics: metrics.map(metric => ({
        expression: metric
      })),
      dimensions: dimensions.map(dimension => ({
        name: dimension
      })),
    }, ],
  }).then(response => response),
};