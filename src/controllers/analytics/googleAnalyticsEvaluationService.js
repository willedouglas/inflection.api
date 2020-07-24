module.exports = {
  normalizeEvaluation: evaluation => evaluation.data.rows ?
    evaluation.data.data.rows.map(row => ({
      date: row.dimensions[0],
      channelGroup: row.dimensions[1],
      metrics: {
        goalValueAll: row.metrics[0].values[0],
        goalCompletionsAll: row.metrics[0].values[1],
        goalConversionRateAll: row.metrics[0].values[2],
      },
    }))
    : [],
};
