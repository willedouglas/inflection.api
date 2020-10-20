const pool = require('../../config/pool');

const requests = async ({
  company_id,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const selectRequests = await client.query('SELECT * FROM adfinance.account where company_id = $1', [company_id]);

    await client.query('COMMIT');

    return selectRequests.rows;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = requests;
