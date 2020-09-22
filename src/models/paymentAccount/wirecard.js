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
                                            and pa.access_token is not null`);

      const access_token = paymentData.rows[0].access_token;
      return access_token;
      
    } catch (error) {
      return error;
    }
};

module.exports = {
  getAccessToken,
};
