const getToday = () => {
  const today = new Date();
  return today.toISOString().substring(0, 10);
}

module.exports = {
  normalizeInsights: insight =>
    insight ? insight.map(insight => ({
      name: insight.campaign_name,
      status: 'N/A',
      type: 'N/A',
      date: getToday(),
      metrics: {
        clicks: insight.clicks,
        impressions: insight.impressions,
        ctr: insight.ctr,
        cost: parseFloat(insight.cpc) + parseFloat(insight.cpm),
        averageCpc: insight.cpc,
        absoluteTopImpressionPercentage: 0,
        topImpressionPercentage: 0,
        conversions: insight.conversions,
        viewThroughConversions: 0,
        costPerConversions: insight.cost_per_conversion,
        conversionsRate: insight.conversion_values,
        averageCpm: insight.cpm,
      },
    })) : [],
};