module.exports = {
  normalizeEvaluation: evaluation =>
    evaluation ? evaluation.map(evaluation => ({
      name: evaluation.campaign_name,
      status: 'none',
      type: 'none',
      date: '0000-00-00',
      metrics: {
        clicks: evaluation.clicks,
        impressions: evaluation.impressions,
        ctr: evaluation.ctr,
        cost: parseFloat(evaluation.cpc) + parseFloat(evaluation.cpm),
        averageCpc: evaluation.cpc,
        absoluteTopImpressionPercentage: 0,
        topImpressionPercentage: 0,
        conversions: evaluation.conversions,
        viewThroughConversions: 0,
        costPerConversions: evaluation.cost_per_conversion,
        conversionsRate: evaluation.conversion_values,
        averageCpm: evaluation.cpm,
      },
    })) : [],
};