'use strict';

const pool = require('../config/pool');
const moment = require('moment');
const sendgrid = require('../resources/sendgrid');

const checkIncompleteRecords = async () => {
    const client = await pool.connect();

    try {
        const records = await client.query('select * from adfinance.account_temp');

        records.rows.map(async record => {
            const createdAt = moment(record.created_at).format('DD/MM/YYYY');
            const twoDaysAgo = moment().subtract(2, 'd').format('DD/MM/YYYY');
            const fourDaysAgo = moment().subtract(4, 'd').format('DD/MM/YYYY');

            const {first_name, last_name, email, phone} = record;

            if (twoDaysAgo === createdAt) {
                const bodySendGrid = {
                  from: { email: 'noreply@a55.tech', name: 'Plataforma a55' },
                  personalizations: [
                    {
                      to: [{ email }],
                      dynamic_template_data: {
                        name: `${first_name} ${last_name}`,
                      },
                    },
                  ],
                  template_id: 'd-61929435d77b403eb2ccfa93fad57cef',
                };
        
                await sendgrid.send(bodySendGrid);

            }else if (fourDaysAgo === createdAt) {
                const bodySendGrid = {
                  from: { email: 'noreply@a55.tech', name: 'Plataforma a55' },
                  personalizations: [
                    {
                      to: [{ email: "corintho@a55.tech" }],
                      subject: "Recuperação AdFinance"
                    },
                  ],
                  content: [
                    {
                      type: "text/html",
                      value: `Usuário abaixo desistiu do cadastro: <br /> Nome: ${first_name} ${last_name} <br /> E-mail: ${email} <br /> Telefone: ${phone} <br /><br />`
                    }
                  ],
                };
        
                await sendgrid.send(bodySendGrid);
            }
            
        });
        
    } catch (err) {
        console.log(err.stack)
    }

};

module.exports = {
    checkIncompleteRecords,
};
