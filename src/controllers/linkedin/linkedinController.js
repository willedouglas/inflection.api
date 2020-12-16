const linkedin = require('../../resources/linkedin');
const { normalizeProfile } = require('./linkedinService');

const authorize = async (request, response) => {
  try {
    const {
      code,
    } = request.body;

    if (!code) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de acesso não encontrado.',
      });
    }

    const { data: authorizeResponse } = await linkedin.authorize(code);

    const { access_token, expires_in } = authorizeResponse;

    return response.status(200).json({
      status: 'success',
      access_token,
      expires_in,
    });
  } catch (e) {
    const errorDescription = e.response && e.response.data && e.response.data.error_description;
    const error = e.response && e.response.data && e.response.data.error;

    return response.status(500).json({
      status: 'error',
      error: error || 'untracked_error',
      description: errorDescription || e.message,
    });
  }
};

const profile = async (request, response) => {
  try {
    const {
      access_token,
    } = request.body;

    if (!access_token) {
      return response.status(400).json({
        status: 'error',
        description: 'Token de acesso não encontrado.',
      });
    }

    const { data: profileResponse } = await linkedin.profile(access_token);

    const { firstName, lastName, profilePicture } = normalizeProfile(profileResponse);

    return response.status(200).json({
      status: 'success',
      firstName,
      lastName,
      profilePicture,
    });
  } catch (e) {
    const errorDescription = e.response && e.response.data && e.response.data.error_description;
    const error = e.response && e.response.data && e.response.data.error;

    return response.status(500).json({
      status: 'error',
      error: error || 'untracked_error',
      description: errorDescription || e.message,
    });
  }
};

module.exports = {
  authorize,
  profile,
};
