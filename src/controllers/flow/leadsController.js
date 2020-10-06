'use strict';

const leadResource = require('../../resources/lead');

const createLead = async (request, response) => {
  try {
    const {
      firstname,
      lastname,
      email,
      company_id: cnpj,
    } = request.body;

    const name = `${firstname} ${lastname}`;

    await leadResource.createLead({ name, email, cnpj, product_id = 4 });

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

module.exports = {
  createLead
};