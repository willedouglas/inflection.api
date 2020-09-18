'use strict';

const sendgrid = require('../../resources/sendgrid');

const sendNotificationMail = async (request, response) => {
  try {
    const {
      name,
      email,
      phone,
      company_name,
      website,
    } = request.body;

    const body = {
      from: {
        email: 'noreply@a55.tech',
        name: 'A55 | Adfinance Notify',
      },
      personalizations: [{
        to: [{
          email: 'cadastro.adfinance@a55.tech',
        }],
        subject: 'Novo cadastro para a análise de crédito',
      }],
      content: [
        {
          type: 'text/html',
          value: `Empresa ${company_name} fez um novo cadastro para a análise de crédito com os seguintes dados: <br /> 
          Nome: ${name} <br /> Email: ${email} <br /> Telefone: ${phone} <br /> Site: ${website} <br /><br />`
        }
      ],
    };

    await sendgrid.send(body);

    return response.status(200).json({
      status: 'success',
      description: 'E-mail enviado à A55 com sucesso!',
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: 'Erro ao enviar o seu e-mail para A55, tente novamente mais tarde.',
    });
  };
};

const sendAbandonmentMail = async (request, response) => {
  try {
    const {
      name,
      email,
    } = request.body;

    const THIRTY_MINUTES_AFTER = Math.round((new Date().getTime() + 30*60000) / 1000);

    const body = {
      from: { email: 'noreply@a55.tech', name: 'A55 | Adfinance' },
      personalizations: [
        {
          to: [ { email } ],
          send_at: THIRTY_MINUTES_AFTER,
          dynamic_template_data: {
            name,
          },
        },
      ],
      template_id: 'd-61929435d77b403eb2ccfa93fad57cef',
    };

    sendgrid.send(body);

    return response.status(200).json({
      status: 'success',
      description: 'E-mail enviado com sucesso!',
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: 'Erro ao enviar o seu e-mail, tente novamente mais tarde.',
    });
  };
};

const sendDataMissingMail = async (request, response) => {
  try {
    const {
      name,
      email,
    } = request.body;

    const TEN_MINUTES_AFTER = Math.round((new Date().getTime() + 10*60000) / 1000);

    const body = {
      from: { email: 'noreply@a55.tech', name: 'A55 | Adfinance' },
      personalizations: [
        {
          to: [ { email } ],
          send_at: TEN_MINUTES_AFTER,
          dynamic_template_data: {
            name,
          },
        },
      ],
      template_id: 'd-c88c64b7b74a48d5baf4d9f729f458ac',
    };

    sendgrid.send(body);

    return response.status(200).json({
      status: 'success',
      description: 'E-mail enviado com sucesso!',
    });
  } catch (e) {
    return response.status(500).json({
      status: 'error',
      description: 'Erro ao enviar o seu e-mail, tente novamente mais tarde.',
    });
  };
};

module.exports = {
  sendNotificationMail,
  sendAbandonmentMail,
  sendDataMissingMail,
};