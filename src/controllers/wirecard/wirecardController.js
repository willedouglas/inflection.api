const express = require('express');
const app = express();
const axios = require('axios');

const wirecard_createapp_url = `https://sandbox.moip.com.br/v2/channels`;
const wirecard_api_url = `https://sandbox.moip.com.br/v2`;
const wirecard_base64_authorization = 'Basic OUhXUVVQRFdCV0xDWU5GMkFHRlBSU0RISVRDVFlKVkY6UlQ4NUtLTUlOQkVNSDhBQzhDTlIwNFBOV1RDSUIzR0NTUEtYUzlLMQ==';
const wirecard_env_production = false;

app.use(express.json());

exports.index = function(req, res){
    res.send('NOT IMPLEMENTED');
}

/*
/wirecard/create/app
** Cria um App junto a Wirecard / Para poder acessar demais serviços

Exemplo de request (POST) recebido
{  
   "name":"a55 AdFinance",
   "description":"Crédito para seu Marketing",
   "site":"https://a55.tech/",
   "redirectUri":"https://a55.tech/retorno"
}
*/
exports.create_app = (req, res) => {
    axios.post(wirecard_createapp_url, req.body, {
        headers: {'Authorization': wirecard_base64_authorization}
    }).then( (retorno) => {
        //console.log(retorno.data);
        return res.status(retorno.status).json({
            codigo: 0,
            status: retorno.status,
            message: retorno.statusText,
            data: retorno.data
        });
    }).catch( (err) => {
        //console.log(err);
        return res.status(400).json({
            error: true,
            message: "Error: " + err
        });
    });
};

/*
/wirecard/auth/
** Solicitar Permissões de Acesso ao Usuário do Wirecard

Exemplo de request (POST) recebido
(Estes dados são fornecidos pela rota: /v1/wirecard/create/app)
{  
   "id": "APP-JKTXODQCG8WC",
        "website": "https://a55.tech/",
        "accessToken": "57bef9e5344c49989d39096b23e4c213_v2",
        "description": "Crédito para seu Marketing",
        "name": "a55 AdFinance",
        "secret": "8e147cf1e1e34e4dbd53b94734a52d29",
        "redirectUri": "https://a55.tech/retorno"
}
*/
exports.auth = (req, res) => {

    const moip = require('moip-sdk-node').default({
        accessToken: req.body.accessToken,
        production: wirecard_env_production
    });

    moip.connect.getAuthorizeUrl({
        clientId: req.body.id,
        redirectUri: req.body.redirectUri,
        scopes: ['RECEIVE_FUNDS', 'REFUND', 'MANAGE_ACCOUNT_INFO', 'TRANSFER_FUNDS', 'RETRIEVE_FINANCIAL_INFO', 'DEFINE_PREFERENCES']
    }).then((url) => {
        //console.log(url);
        return res.status(200).json({
            codigo: 0,
            status: 200,
            message: 'URL Criada',
            urlOpen: url
        });
    }).catch((err) => {
        //console.log(err);
        return res.status(400).json({
            error: true,
            message: "Error: " + err
        });
    });      
};

/*
/wirecard/accesstoken/
** Com a permissão concedida, você receberá um code que lhe permitirá recuperar o accessToken de autenticação 
e processar requisições envolvendo outro usuário. Seguindo a especificação do OAuth 2.0 Authorization Framework 
essa request é feita com os atributos em x-www-form-urlencoded, ao invés de um JSON.

Exemplo de request (POST) recebido
(Estes dados são fornecidos pela rota: /v1/wirecard/create/app)
{  
    "id": "APP-OJJG95ZY054L",
        "website": "https://a55.tech/",
        "accessToken": "cd4226ca445241218c4fcd21a2ae1f3d_v2",
        "description": "Crédito para seu Marketing",
        "name": "a55 AdFinance",
        "secret": "ec13833e1e8149e8a58bdd87a185bf31",
        "redirectUri": "https://a55.tech/retorno",
        "code": "14c595bc69a2539e13e0771286a8be836babe663"
}

TOKEN_GERADO (RETORNO)
{\"accessToken\":\"5458d65983c7467785e285e0d46b57ad_v2\",\"access_token\":\"5458d65983c7467785e285e0d46b57ad_v2\",\"expires_in\":\"2030-07-28\",\"refreshToken\":\"87a91ae44dc940deac653d01587eaddf_v2\",\"refresh_token\":\"87a91ae44dc940deac653d01587eaddf_v2\",\"scope\":\"RECEIVE_FUNDS,REFUND,MANAGE_ACCOUNT_INFO,TRANSFER_FUNDS,RETRIEVE_FINANCIAL_INFO,DEFINE_PREFERENCES\",\"moipAccount\":{\"id\":\"MPA-E943AAD386D6\"}}

*/
exports.access_token = (req, res) => {

    const moip = require('moip-sdk-node').default({
        accessToken: req.body.accessToken,
        production: wirecard_env_production
    });

    moip.connect.generateToken({
        client_id: req.body.id,
        redirect_uri: req.body.redirectUri,
        client_secret: req.body.secret,
        grant_type: 'authorization_code',
        code: req.body.code
    }).then((response) => {
        //console.log(response)
        return res.status(200).json({
            error: false,
            data: response.body
        });
    }).catch((err) => {
        //console.log(err) 
        return res.status(400).json({
            error: true,
            message: err
        });
    });        
};

/*
/wirecard/order/
** Por meio desta API é possível criar um Pedido na Wirecard que irá conter os dados da venda 
de um produto ou serviço.

Exemplo de request (POST) recebido
{  
    "ownId": "a55TEST001",
    "currency": "BRL",
    "accessToken": "d41a59dac0534bc19841cb17192bc32a_v2",
    "shipping": 1500,
    "product": "Bolo da Vovó",
    "quantity": 1,
    "detail": "Mais informações sobre o produto",
    "price": 1500,
    "customerId": "CUS-ID-001",

    "customer": {
            "ownId": "1521656726",
            "fullname": "Jose Silva",
            "email": "jose_silva0@email.com",
            "birthDate": "1988-12-30",
            "taxDocument": {
                "type": "CPF",
                "number": "22222222222"
            },
            "phone": {
                "countryCode": "55",
                "areaCode": "11",
                "number": "66778899"
            },
            "shippingAddress": {
                "street": "Avenida Faria Lima",
                "streetNumber": 2927,
                "complement": 8,
                "district": "Itaim",
                "city": "Sao Paulo",
                "state": "SP",
                "country": "BRA",
                "zipCode": "01234000"
            }
        }
}
*/
exports.order = (req, res) => {

    const moip = require('moip-sdk-node').default({
        accessToken: req.body.accessToken,
        production: wirecard_env_production
    });

    moip.order.create({
        ownId: req.body.ownId,
        amount: {
            currency: req.body.currency,
            subtotals: {
                shipping: req.body.shipping
            }
        },
        items: [{
            product: req.body.product,
            quantity: req.body.quantity,
            detail: req.body.detail,
            price: req.body.price
        }],
        customer: req.body.customer
    }).then((response) => {
        //console.log(response.body)
        return res.status(200).json({
            error: false,
            data: response.body
        });
    }).catch((err) => {
        //console.log(err)
        return res.status(400).json({
            error: true,
            data: err
        });
    });
};

/* 
GET
/wirecard/orders/all/:accessToken
Liste todos pedidos criados anteriormente. Os pedidos são ordenados pela data de criação, 
dos mais recentes para os mais antigos. Nesta versão da API são retornados apenas pedidos 
que contenham ao menos um pagamento.

Exemplo URL: http://localhost:3335/wirecard/orders/all/5458d65983c7467785e285e0d46b57ad_v2

*/
exports.orders_all = function(req, res) {
    axios.get(wirecard_api_url + `/orders`, {
        headers: {'Authorization': 'OAuth ' + req.params.accessToken}
    }).then((response) => {
        return res.status(200).json({
            error: false,
            data: response.data
        });
    }).catch( (err) => {
        return res.status(400).json({
            error: true,
            data: err
        });
    });
};

/*
GET
/wirecard/order/:orderid/:accessToken
** Por meio desta API é possível obter detalhes sobre um pedido realizado

Exemplo URL
http://localhost:3335/wirecard/order/ORD-LNINC8DWSKOT/5458d65983c7467785e285e0d46b57ad_v2

*/
exports.order_one = function(req, res) {
    const moip = require('moip-sdk-node').default({
        accessToken: req.params.accessToken,
        production: wirecard_env_production
    });

    moip.order.getOne(req.params.orderid)
    .then((response) => {
        //console.log(response.body)
        return res.status(200).json({
            error: false,
            data: response
        });
    }).catch((err) => {
        //console.log(err)
        return res.status(400).json({
            error: true,
            data: err
        });
    });
};

/*
POST
/wirecard/payment

**Crie um pagamento com cartão de crédito

TODO: Neste momento está com os dados fixos pois não é objetivo no produto/negocio neste momento

Exemplo de Json
{
    "orderid": "ORD-LNINC8DWSKOT",
    "accessToken": "5458d65983c7467785e285e0d46b57ad_v2"    
}

*/
exports.payment = (req,res) => {

    const moip = require('moip-sdk-node').default({
        accessToken: req.body.accessToken,
        production: wirecard_env_production
    });
    
    moip.payment.create(req.body.orderid, {
        installmentCount: 1,
        fundingInstrument: {
            method: 'CREDIT_CARD',
            creditCard: {
                hash: 'cp7EX1LIqdyeHxWp2oXLyssG+v0MOMDkYj5jPrIKvmlUTQIayOibKoF8WBaj9mewj50weDNCrkp2Vey1kB3SDeQ80iEcQfEemk4UV/BXVxQRofZKP25zqH4W/wrL7SBmUMi8hUcscJ9OrwaPmLql1bJocXNcvgRYmrWhnuSErn+fDdXiBDXfb/HjbyfxinT0KU3DZTBSvIy635tLioiZvcGfde2N7vuiuKYoLZGa22SZTAjUpmVVG+f0VX5My8qdhjqAs5OtF9hAM8xh8xqJ53yin8xx85gL7Rrj/G3axIhnSXgOUXlJOgXtvYC+piXctlfVGH778jq14787a6GmIQ==',
                holder: {
                    fullname: 'Corintho Fernandes',
                    birthdate: '1982-06-08',
                    taxDocument: {
                        type: 'CPF',
                        number: '11111111111'
                    },
                    phone: {
                        countryCode: '55',
                        areaCode: '11',
                        number: '25112511'
                    }
                }
            }
        }
    }).then((response) => {
        //console.log(response.body)
        return res.status(200).json({
            error: false,
            data: response
        });
    }).catch((err) => {
        //console.log(err)
        return res.status(400).json({
            error: true,
            data: err
        });
    })
};

/* GET
TODO

Forçar autorização de Pagamento
https://sandbox.moip.com.br/simulador/authorize?payment_id=codigo&amount=valor

*/

/* 
GET
/wirecard/saldo/:accessToken
Por meio desta API é possível consultar os saldos de uma Conta Wirecard.
*/
exports.saldo = function(req, res) {
    axios.get(wirecard_api_url + `/balances`, {
        headers: {
            'Authorization': 'OAuth ' + req.params.accessToken,
            'Accept': 'application/json;version=2.1'
        }
    }).then((response) => {
        return res.status(200).json({
            error: false,
            data: response.data
        });
    }).catch( (err) => {
        return res.status(400).json({
            error: true,
            data: err
        });
    });
};

/* 
GET
/wirecard/extrato/liquidado/:begin/:end/:accessToken

Exibe o extrato consolidado de recebíveis que já foram liquidados na conta. 
O período máximo de exibição do extrato financeiro é de 180 dias.
*/
exports.extrato_liquidado = function(req, res) {
    axios.get(wirecard_api_url + `/statements?begin=${req.params.begin}&end=${req.params.end}`, {
        headers: {
            'Authorization': 'OAuth ' + req.params.accessToken
        }
    }).then((response) => {
        return res.status(200).json({
            error: false,
            data: response.data
        });
    }).catch( (err) => {
        //console.log(err);
        return res.status(400).json({
            error: true,
            data: err
        });
    });
};

/* 
GET
/wirecard/extrato/futuro/:begin/:end/:accessToken

Exibe o extrato consolidado por dia de recebíveis que ainda não foram liquidados na conta. 
O período máximo de exibição do extrato financeiro é de 365 dias.
*/
exports.extrato_futuro = function(req, res) {
    axios.get(wirecard_api_url + `/futurestatements?begin=${req.params.begin}&end=${req.params.end}`, {
        headers: {
            'Authorization': 'OAuth ' + req.params.accessToken
        }
    }).then((response) => {
        return res.status(200).json({
            error: false,
            data: response.data
        });
    }).catch( (err) => {
        //console.log(err);
        return res.status(400).json({
            error: true,
            data: err
        });
    });
};