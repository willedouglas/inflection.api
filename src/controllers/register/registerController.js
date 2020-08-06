'use strict';

const registerAccount = require('../../models/register/register');

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
      payment,
    } = request.body;

    await registerAccount({
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
      payment,
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

module.exports = {
  register
};