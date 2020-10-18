const api = require('../helpers/api');

const isProduction = process.env.ENV === 'production';

const handleClientProcessError = (error) => {
	if (
		error.response.data &&
		error.response.data.message.includes("already exists")
	) {
		return Promise.resolve();
	}
	return error;
};

const apiHelper = api({
  baseURL: `${ isProduction ? 'https://document-api.a55.tech' : 'https://document-api-staging.a55.tech' }`,
  headers: {
    Authorization: `ApiKey ${ isProduction ? '8f28922d-f837-4cb4-a6e7-16d7c07bf518' : 'b2d4b379-db47-42c0-a8c2-ee3d037cad3d' }`
  },
});

module.exports = {
  clientProcess: ({ client_tax_id, process_template_id, groups }) => apiHelper
    .post('/clientProcess', { client_tax_id, process_template_id, groups })
    .catch((error) => handleClientProcessError(error)),
};
