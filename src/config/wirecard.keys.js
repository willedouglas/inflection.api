/* eslint-disable no-nested-ternary */

const isStaging = process.env.ENV === 'staging';
const isProduction = process.env.ENV === 'production';

module.exports = {
  client_id: isProduction ? 'APP-HAHCRMXKMJO8' : isStaging ? 'APP-K3ME7DC6BMDC' : 'APP-R3147C9RE7HU',
  client_idTransfer: isProduction ? 'APP-4LZ5D8BT8N7M' : isStaging ? 'APP-0AYZZTTO71A5' : 'APP-2ABTSK4YMZNE',
  moip_account: isProduction ? 'MPA-B7BED7D1FA46' : isStaging ? 'MPA-E943AAD386D6' : 'MPA-E943AAD386D6',
  client_secret: isProduction ? 'bdfbbb41331e4749872ff6c33e254a79' : isStaging ? 'b71ffcec3877423b827d325e0d794d14' : 'e54ce1a5212a4f43b1aa8aaca6904273',
  client_secretTransfer: isProduction ? '791f37ecbbe44d7bbbf94a2a2e7eb1c2' : isStaging ? 'f64ca93fa1fc459f81960324c199d00f' : '04a6339702a04491895fd231b77d084a',
  redirectUri: isProduction ? 'https://adfinance-register.a55.tech/wirecard' : isStaging ? 'https://adfinance-register-staging.a55.tech/wirecard' : 'https://plataforma.a55.local:8080/app/servicos-financeiros/mkt?readonly=1',
  redirectTransferUri: isProduction ? 'https://plataforma.a55.tech/app/servicos-financeiros/mkt' : isStaging ? 'https://plataforma-staging.a55.tech/app/servicos-financeiros/mkt' : 'https://plataforma.a55.local:8080/app/servicos-financeiros/mkt',
  accessToken: isProduction ? '4f8b8c6abc6b49ddbc2aea9d4e1c1686_v2' : isStaging ? '5817fadfcc67460aaddf69700afe1a90_v2' : '04928763b7f24afa9c011ffe21999462_v2',
  accessTokenTransfer: isProduction ? '1ec4fe90a6a24e0983f3970b57bea4fb_v2' : isStaging ? 'cb92219f75d5438b94257b13429f890b_v2' : '83aa98166aec4c06bd398f2f89048b6e_v2',
  scopes: ['RETRIEVE_FINANCIAL_INFO'],
  scopes_transfer: ['RETRIEVE_FINANCIAL_INFO', 'TRANSFER_FUNDS'],
};
