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

const isEmpty = (obj) => {
  for(let prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}; 

module.exports = {
  normalizeStatements,
  isEmpty,
};
