'use strict';

const pool = require('../../config/pool');

const getAccessToken = async ({
  company_id,
}) => {
    const client = await pool.connect();

    try {
      const paymentData = await client.query(`select pa.account_id, pa.access_token 
                                            from adfinance.payment_account pa 
                                            
                                            inner join adfinance.account ac 
                                            on ac.id = pa.account_id
                                            
                                          where 
                                            ac.company_id = '${company_id}' 
                                            and pa.method = 'WIRECARD' 
                                            and pa.authorized_transfer <> 1 
                                            and pa.access_token is not null`);

      const access_token = paymentData.rows[0].access_token;
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
      const paymentData = await client.query(`select pa.account_id, pa.access_token 
                                            from adfinance.payment_account pa 
                                            
                                            inner join adfinance.account ac 
                                            on ac.id = pa.account_id
                                            
                                          where 
                                            ac.company_id = '${company_id}' 
                                            and pa.method = 'WIRECARD' 
                                            and pa.authorized_transfer = 1 
                                            and pa.access_token is not null`);

      const access_token = paymentData.rows[0].access_token;
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

    try {
      await client.query(`update adfinance.payment_account 
                          set access_token = '${access_token}', 
                            authorized_transfer = 1 
                          where account_id in ( select ac.id from adfinance.account ac where ac.company_id = '${company_id}' )`);

    } catch (error) {
      throw error;
    }
};

module.exports = {
  getAccessToken,
  getAccessTokenAuthorizedTransfer,
  setNewAccessTokenTransfer,
};
