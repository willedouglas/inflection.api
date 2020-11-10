const pool = require('../../config/pool');

const getCard = async ({
  account_id,
}) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const card = await client.query(`
      SELECT proxy, activate_code, account_number, created_on
      FROM adfinance.bankly_account
      WHERE account_id = $1 ORDER BY id DESC LIMIT 1;`, [account_id]);
    await client.query('COMMIT');
    return card.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const insertVirtualCard = async ({
  account_id,
  proxy,
  activate_code,
  account_number,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const accounts = await client.query(`
    INSERT INTO adfinance.bankly_account (
      account_id,
      proxy,
      activate_code,
      account_number
    ) VALUES($1, $2, $3, $4)`, [account_id, proxy, activate_code, account_number]);
    await client.query('COMMIT');
    return accounts.rows;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = {
  getCard,
  insertVirtualCard,
};
