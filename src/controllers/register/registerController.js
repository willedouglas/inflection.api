'use strict';
const authResource = require('../../resources/auth');
const registerModel = require('../../models/register/register');
const sendgridResource = require('../../resources/sendgrid');
const documentResource = require('../../resources/document');

const isProduction = process.env.ENV === 'production';

const {
  cleanString,
} = require('../../helpers/format');

const register = async (request, response) => {
  try {
    const {
      how_meet_us,
      firstname,
      lastname,
      email,
      phone,
      role,
      company_name,
      company_id,
      website,
      monthly_gross_revenue,
      corporate_name,
      company_category,
      company_zip,
      company_address_number,
      average_monthly_ads_investment,
      ads,
      analytics,
      payments,
    } = request.body;

    await registerModel.register({
      how_meet_us,
      firstname,
      lastname,
      email,
      phone,
      role,
      company_name,
      company_id,
      website,
      monthly_gross_revenue,
      corporate_name,
      company_category,
      company_zip,
      company_address_number,
      average_monthly_ads_investment,
      ads,
      analytics,
      payments,
    });

    return response.status(201).json({
      status: 'created',
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  };
};

const update = async (request, response) => {
  try {
    const {
      how_meet_us,
      firstname,
      lastname,
      email,
      phone,
      role,
      company_name,
      company_id,
      website,
      monthly_gross_revenue,
      corporate_name,
      company_category,
      company_zip,
      company_address_number,
      average_monthly_ads_investment,
    } = request.body;

    await registerModel.update({
      how_meet_us,
      firstname,
      lastname,
      email,
      phone,
      role,
      company_name,
      company_id,
      website,
      monthly_gross_revenue,
      corporate_name,
      company_category,
      company_zip,
      company_address_number,
      average_monthly_ads_investment,
    });

    return response.status(201).json({
      status: 'updated',
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  };
};

const upload = async (request, response) => {
  try {
    const token = request.headers.authorization;
    const {
      company_id,
      method,
    } = request.body;

    const { file } = request.files;

    if (!method) {
      return response.status(400).json({
        status: 'error',
        description: 'Método não informado.',
      });
    }

    if (!company_id) {
      return response.status(400).json({
        status: 'error',
        description: 'Empresa não informada.',
      });
    }

    if (!file) {
      return response.status(400).json({
        status: 'error',
        description: 'Arquivo não informado.',
      });
    }

    const ADFINANCE_REPORT_TEMPLATE_ID = isProduction
      ? "5f80a13d753f83892707c021"
      : "5f875ff1859d30a763c43972";

    const NORMALIZED_DOCUMENT_ID = {
      "GOOGLE_ADS": isProduction
        ? "5f869475e7010215b1a5a31c"
        : "5f87791c79b369b334f75c9c",
      "FACEBOOK_ADS": isProduction
        ? "5f869475e7010215b1a5a31d"
        : "5f88853ed60abfbcf9b92b22",
      "INSTAGRAM_ADS": isProduction
        ? "5f869475e7010215b1a5a31e"
        : "5f88853fd60abfbcf9b92b23",
    };

    await authResource.getClearance({
      token,
      company_id,
    });

    await documentResource.clientProcess({
      client_tax_id: company_id,
      process_template_id: ADFINANCE_REPORT_TEMPLATE_ID,
      groups: {},
    });

    await documentResource.upload({
      document_id: NORMALIZED_DOCUMENT_ID[method],
      file,
      client_tax_id: company_id,
    });

    await registerModel.upload({
      company_id,
      method,
    });

    return response.status(201).json({
      status: 'uploaded',
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
      detail: e.response && e.response.data
    });
  };
};

const uploads = async (request, response) => {
  try {
    const token = request.headers.authorization;
    let {
      company_id
    } = request.query;

    company_id = cleanString(company_id);

    if (!token) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de autorização não encontrado.',
      });
    }

    if (!company_id) {
      return response.status(400).json({
        status: 'error',
        description: 'Empresa não informada.',
      });
    }

    await authResource.getClearance({
      token,
      company_id,
    });

    const searchedUploads = await registerModel.uploads({
      company_id,
    });

    return response.status(200).json({
      status: 'success',
      data: searchedUploads,
    });
  } catch (e) {
    const errorMessage = e.response && e.response.data && e.response.data.detail || 'Erro desconhecido, aguarde uns instantes e tente novamente.';
    return response.status(500).json({
      status: 'error',
      description: errorMessage,
    });
  };
};

const registerTemporary = async (request, response) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
    } = request.body;

    await registerModel.registerTemporaryAccount({
      firstname,
      lastname,
      email,
      phone,
    });

    const THIRTY_MINUTES_AFTER = Math.round((new Date().getTime() + 30*60000) / 1000);

    const bodySendgrid = {
      from: { email: 'noreply@a55.tech', name: 'A55 | Adfinance' },
      personalizations: [
        {
          to: [ { email } ],
          send_at: THIRTY_MINUTES_AFTER,
          dynamic_template_data: {
            name: `${firstname} ${lastname}`,
          },
        },
      ],
      template_id: 'd-61929435d77b403eb2ccfa93fad57cef',
    };

    sendgridResource.send(bodySendgrid);

    return response.status(201).json({
      status: 'created temporary',
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  };
};

module.exports = {
  register,
  update,
  uploads,
  upload,
  registerTemporary,
};