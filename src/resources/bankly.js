const api = require('../helpers/api');

const getAccessToken = async() => {
    const authServerUrl = process.env.BANKLY_AUTH_SERVER_URL
    const apiHelper = api({
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        }
    })
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', process.env.BANKLY_CLIENT_ID);
    params.append('client_secret',process.env.BANKLY_CLIENT_SECRET);

    const response = await apiHelper.post(authServerUrl, params);
    return response.data.access_token;
}

// const createVirtualCard = async () => {
//     try {
//
//
//         const token = await getAccessToken();
//         const apiBearer = api({
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`,
//                 "api-version": "1.0"
//             }
//         })
//         console.log(apiBearer)
//         const payload = {
//             documentNumber: '33837677877'
//         }
//         console.log(`${process.env.BANKLY_SANDBOX_URL}cards/virtual`)
//         const result = await apiBearer.post(`${process.env.BANKLY_SANDBOX_URL}cards/virtual`, payload)
//         console.log(result)
//         return result.data.activateCode
//     } catch (e) {
//         console.log(e.message)
//     }
// }

module.exports = {
    getAccessToken,
    // createVirtualCard
}