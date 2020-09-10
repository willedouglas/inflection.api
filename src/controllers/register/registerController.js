'use strict';

const registerModel = require('../../models/register/register');
const sendgrid = require('../../resources/sendgrid');

const register = async (request, response) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      role,
      company_name,
      company_id,
      website,
      monthly_gross_revenue,
      ads,
      analytics,
      payments,
    } = request.body;

    await registerModel.register({
      firstname,
      lastname,
      email,
      phone,
      role,
      company_name,
      company_id,
      website,
      monthly_gross_revenue,
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

    sendgrid.send(bodySendgrid);

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
  registerTemporary,
};