const date = new Date();
const currentYear = date.getFullYear();

module.exports = {
  startDate: `${currentYear - 1}-01-01`,
  endDate: `${currentYear}-12-31`,
  begin: `${currentYear}-08-01`,
  end: `${currentYear}-12-31`,
};
