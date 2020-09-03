'use strict';

const sendgrid = require('../../resources/sendgrid');

const sendConfirmationMail = async (request, response) => {
  try {
    const {
      name,
      to
    } = request.body;

    if (!name) {
      return response.status(400).json({
        status: 'error',
        description: 'Nome do destinatário não informado.',
      })
    }

    if (!to) {
      return response.status(400).json({
        status: 'error',
        description: 'E-mail do destinatário não informado.',
      })
    }

    const body = {
      from: {
        email: 'noreply@a55.tech',
        name: 'A55 | Adfinance',
      },
      personalizations: [{
        to: [{
          email: to,
        }],
        dynamic_template_data: {
          name,
        },
      }],
      template_id: 'd-5c931b95d92a42049acec5d39957dc1e',
    };

    await sendgrid.send(body);

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

    const ONE_MINUTE_AFTER = Math.round((new Date().getTime() + 60000) / 1000);

    const body = {
      from: { email: 'noreply@a55.tech', name: 'A55 | Adfinance' },
      personalizations: [
        {
          to: [ { email } ],
          send_at: ONE_MINUTE_AFTER,
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

module.exports = {
  sendConfirmationMail,
  sendNotificationMail,
  sendAbandonmentMail,
};