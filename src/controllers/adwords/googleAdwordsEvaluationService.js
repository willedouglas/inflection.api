module.exports = {
  normalizeEvaluation: evaluation =>
    evaluation.data.results ? evaluation.data.results.map(evaluation => ({
      id: evaluation.campaign.id,
      name: evaluation.campaign.name,
      status: evaluation.campaign.status,
      type: evaluation.campaign.advertisingChannelType,
      date: evaluation.segments.date,
      metrics: {
        clicks: evaluation.metrics.clicks,
        impressions: evaluation.metrics.impressions,
        ctr: evaluation.metrics.ctr,
        cost: evaluation.metrics.costMicros,
        averageCpc: evaluation.metrics.averageCpc,
        absoluteTopImpressionPercentage: evaluation.metrics.absoluteTopImpressionPercentage,
        topImpressionPercentage: evaluation.metrics.topImpressionPercentage,
        conversions: evaluation.metrics.conversions,
        viewThroughConversions: evaluation.metrics.viewThroughConversions,
        costPerConversions: evaluation.metrics.costPerAllConversions,
        conversionsRate: evaluation.metrics.conversionsFromInteractionsRate,
        averageCpm: evaluation.metrics.averageCpm,
      },
    })) : [],
};