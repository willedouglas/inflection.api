const isStaging = process.env.ENV === 'staging';
const isProduction = process.env.ENV === 'production';

module.exports = {
  client_id: isProduction ? 'APP-HAHCRMXKMJO8' : isStaging ? 'APP-K3ME7DC6BMDC' : 'APP-R3147C9RE7HU',
  moip_account: isProduction ? 'MPA-B7BED7D1FA46' : isStaging ? 'MPA-E943AAD386D6' : 'MPA-E943AAD386D6',
  client_secret: isProduction ? 'bdfbbb41331e4749872ff6c33e254a79' : isStaging ? 'b71ffcec3877423b827d325e0d794d14' : 'e54ce1a5212a4f43b1aa8aaca6904273',
  redirectUri: isProduction ? 'https://adfinance-register.a55.tech/wirecard' : isStaging ? 'https://adfinance-register-staging.a55.tech/wirecard' : 'https://localhost:8081/wirecard',
  accessToken: isProduction ? '4f8b8c6abc6b49ddbc2aea9d4e1c1686_v2' : isStaging ? '5817fadfcc67460aaddf69700afe1a90_v2' : '04928763b7f24afa9c011ffe21999462_v2',
  scopes: ['RETRIEVE_FINANCIAL_INFO'],
};