const wirecard = require('../../resources/wirecard');
const { begin, end } = require('../../../constants');
const { normalizeStatements } = require('./wirecardService');
const { companyIdValidate } = require('../../helpers/format');
const {
  getAccessToken, getAccessTokenAuthorizedTransfer, setNewAccessTokenTransfer, setReadAccessToken,
} = require('../../models/paymentAccount/wirecard');
const keys = require('../../config/wirecard.keys');
const authResource = require('../../resources/auth');

const getAuthorizeUrl = async (request, response) => {
  try {
    const url = await wirecard.getAuthorizeUrl();

    return response.status(200).json({
      status: 'success',
      data: {
        url,
      },
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

const getAuthorizeTransferUrl = async (request, response) => {
  try {
    const url = await wirecard.getAuthorizeTransferUrl();

    return response.status(200).json({
      status: 'success',
      data: {
        url,
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
      code,
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

const generateTokenTransfer = async (request, response) => {
  try {
    const {
      code,
    } = request.body;

    if (!code) {
      return response.status(400).json({
        status: 'error',
        description: 'Código de autorização não informado.',
      });
    }

    const { body } = await wirecard.generateTokenTransfer({ code });

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

const setNewToken = async (request, response) => {
  try {
    const {
      company_id,
      access_token,
    } = request.body;

    await setNewAccessTokenTransfer({ company_id, access_token });

    return response.status(201).json({
      status: 'created',
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

const setReadToken = async (request, response) => {
  try {
    const {
      company_id,
      access_token,
    } = request.body;

    await setReadAccessToken({ company_id, access_token });

    return response.status(201).json({
      status: 'created',
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

const getBalances = async (request, response) => {
  try {
    const token = request.headers.authorization;
    const {
      company_id,
    } = request.query;

    await authResource.getClearance({ token, company_id });

    if (!company_id || !companyIdValidate(company_id)) {
      return response.status(400).json({
        status: 'error',
        description: 'CNPJ inválido ou não informado.',
      });
    }

    const access_token = await getAccessTokenAuthorizedTransfer({ company_id });
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
      company_id,
    } = request.body;

    const access_token = await getAccessTokenAuthorizedTransfer({ company_id });

    const body = {
      amount,
      transferInstrument: {
        method: 'MOIP_ACCOUNT',
        moipAccount: {
          id: `${keys.moip_account}`,
        },
      },
    };

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

const transferToBankAccount = async (request, response) => {
  try {
    const {
      amount,
      bankNumber,
      agencyNumber,
      agencyCheckNumber,
      accountNumber,
      accountCheckNumber,
      holder,
    } = request.body;
    const data = await wirecard.transferToBankAccount({
      amount,
      bankNumber,
      agencyNumber,
      agencyCheckNumber,
      accountNumber,
      accountCheckNumber,
      holder,
    });

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

const checkIsWirecard = async (request, response) => {
  try {
    const {
      company_id,
    } = request.query;

    if (!company_id) {
      return response.status(400).json({
        status: 'error',
        description: 'CNPJ inválido ou não informado.',
      });
    }

    const access_token = await getAccessToken({ company_id });

    return response.status(200).json({
      status: 'success',
      data: access_token,
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
  getAuthorizeTransferUrl,
  transferToWirecardAccount,
  transferToBankAccount,
  checkIsWirecard,
  generateTokenTransfer,
  setNewToken,
  setReadToken,
};
