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

module.exports = {
  sendConfirmationMail,
};