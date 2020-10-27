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
    const product_id = 4;

    await leadResource.createLead({
      name, email, cnpj, product_id,
    });

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

module.exports = {
  createLead,
};
