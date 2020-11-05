const Sentry = require('@sentry/node');
const leadResource = require('../../resources/lead');
const Product = require('../../enums/product');

const createLead = async (request, response) => {
  try {
    const {
      firstname,
      lastname,
      email,
      company_id: cnpj,
    } = request.body;

    const name = `${firstname} ${lastname}`;
    const product_id = Product.ADSFINANCE;

    await leadResource.createLead({
      name, email, cnpj, product_id,
    });

    return response.status(201).json({
      status: 'created',
    });
  } catch (e) {
    console.info(e);
    Sentry.captureException(e);
    return response.status(500).json({
      status: 'error',
      description: e.message,
    });
  }
};

module.exports = {
  createLead,
};
