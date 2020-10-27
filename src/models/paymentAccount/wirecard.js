const pool = require('../../config/pool');

const getAccessToken = async ({
  company_id,
}) => {
  const client = await pool.connect();

  try {
    const paymentData = await client.query(`
      SELECT
        pa.account_id, pa.access_token 
      FROM
        adfinance.payment_account pa 
      INNER JOIN
        adfinance.account ac 
      ON
        ac.id = pa.account_id
      WHERE 
        ac.company_id = $1 
      AND
        pa.method = 'WIRECARD' 
      AND
        pa.authorized_transfer <> 1 
      AND
        pa.access_token is not null`, [company_id]);

    const { access_token } = paymentData.rows[0];
    return access_token;
  } catch (error) {
    return error;
  }
};

const getAccessTokenAuthorizedTransfer = async ({
  company_id,
}) => {
  const client = await pool.connect();

  try {
    const paymentData = await client.query(`
      SELECT
        pa.account_id, pa.access_token 
      FROM
        adfinance.payment_account pa   
      INNER JOIN
        adfinance.account ac 
      ON
        ac.id = pa.account_id                                    
      WHERE
        ac.company_id = $1 
      AND
        pa.method = 'WIRECARD' 
      AND
        pa.authorized_transfer = 1 
      AND
        pa.access_token is not null`, [company_id]);

    const { access_token } = paymentData.rows[0];
    return access_token;
  } catch (error) {
    return error;
  }
};

const setNewAccessTokenTransfer = async ({
  company_id,
  access_token,
}) => {
  const client = await pool.connect();
  await client.query(`
    UPDATE
      adfinance.payment_account
    SET
      access_token = $1,
      authorized_transfer = 1
    WHERE
      account_id IN (SELECT ac.id FROM adfinance.account ac WHERE ac.company_id = $2)`, [access_token, company_id]);
};

module.exports = {
  getAccessToken,
  getAccessTokenAuthorizedTransfer,
  setNewAccessTokenTransfer,
};
