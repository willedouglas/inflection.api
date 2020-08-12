const isStaging = process.env.ENV === 'staging';
const isProduction = process.env.ENV === 'production';

module.exports = {
  client_id: isProduction ? 'APP-HAHCRMXKMJO8' : isStaging ? 'APP-K3ME7DC6BMDC' : 'APP-SVS317VVB2IC',
  client_secret: isProduction ? 'bdfbbb41331e4749872ff6c33e254a79' : isStaging ? 'b71ffcec3877423b827d325e0d794d14' : 'c3d66ebef7844030bda1b00ff10170ea',
  redirectUri: isProduction ? 'https://adfinance-register.a55.tech/wirecard' : isStaging ? 'https://adfinance-register-staging.a55.tech/wirecard' : 'http://localhost:8081/wirecard',
  accessToken: isProduction ? '4f8b8c6abc6b49ddbc2aea9d4e1c1686_v2' : isStaging ? '5817fadfcc67460aaddf69700afe1a90_v2' : '94dc79ab48344a9da6b8b3abe575b211_v2',
  scopes: ['RETRIEVE_FINANCIAL_INFO'],
};