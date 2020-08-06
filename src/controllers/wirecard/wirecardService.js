const normalizeStatements = statements => ({
  summary: {
    credit: statements.summary.creditSum,
    debit: statements.summary.debitSum,
  },
  detail: statements.lines.map(line => ({
    amount: line.amount,
    description: line.description,
    type: line.type,
    date: line.date,
  }))
});

module.exports = {
  normalizeStatements,
};
