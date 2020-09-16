const wirecard = require('../../resources/wirecard');
const { begin, end } = require('../../../constants');
const { normalizeStatements } = require('./wirecardService');
const { cnpjValidate } = require('../../helpers/format');
const pool = require('../../config/pool');

const getAuthorizeUrl = async (request, response) => {
  try {
    const url = await wirecard.getAuthorizeUrl();

    return response.status(200).json({
      status: 'success',
      data: {
        url
      },
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

const generateToken = async (request, response) => {
  try {
    const {
      code
    } = request.body;

    if (!code) {
      return response.status(400).json({
        status: 'error',
        description: 'Código de autorização não informado.',
      });
    }

    const { body } = await wirecard.generateToken({ code });

    const {
      access_token,
      refresh_token,
      expires_in,
    } = JSON.parse(body);

    return response.status(200).json({
      status: 'success',
      data: {
        access_token,
        refresh_token,
        expires_in,
      },
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

const getStatements = async (request, response) => {
  try {
    const { data: statements } = await wirecard.getStatements({
      begin,
      end,
    });

    return response.status(200).json({
      status: 'success',
      data: normalizeStatements(statements),
    });

  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

const getAccessToken = async (company_id) => {
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
    console.log(error);
    return error;
  }
};

const getBalances = async (request, response) => {
  try {
    const {
      company_id
    } = request.query;

    if (!company_id || !cnpjValidate(company_id)) {
      return response.status(400).json({
        status: 'error',
        description: 'CNPJ inválido ou não informado.',
      });
    }

    const access_token = await getAccessToken(company_id);
    const { data } = await wirecard.getBalance({ access_token });
    
    return response.status(200).json({
      status: 'success',
      data,
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

const transferToWirecardAccount = async (request, response) => {
  try {
    const {
      amount,
      company_id
    } = request.body;

    const access_token = await getAccessToken(company_id);
    
    const body = {
      amount,
      transferInstrument:{  
         method:"MOIP_ACCOUNT",
         moipAccount:{  
            id:"MPA-E943AAD386D6"
         }
      }
    }
    
    const { data } = await wirecard.transferToWirecardAccount({ access_token, body });
    
    return response.status(200).json({
      status: 'success',
      data,
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

module.exports = {
  getAuthorizeUrl,
  generateToken,
  getStatements,
  getBalances,
  transferToWirecardAccount,
}