'use strict';

const pool = require('../../config/pool');

const register = async ({
  how_meet_us,
  firstname,
  lastname,
  email,
  phone,
  role,
  company_name,
  company_id,
  website,
  monthly_gross_revenue,
  corporate_name,
  company_category,
  company_zip,
  company_address_number,
  average_monthly_ads_investment,
  ads,
  analytics,
  payments,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let adsQuery, analyticsQuery, paymentsQuery;

    const insertAccountQuery = await client.query(`
    INSERT INTO
      adfinance.account (
        first_name,
        last_name,
        email,
        phone,
        role,
        company_name,
        company_id,
        website,
        monthly_gross_revenue,
        corporate_name,
        company_category,
        company_zip,
        company_address_number,
        average_monthly_ads_investment,
        how_meet_us
      )
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING
      id`,
      [
        firstname,
        lastname,
        email,
        phone,
        role,
        company_name,
        company_id,
        website,
        monthly_gross_revenue,
        corporate_name,
        company_category,
        company_zip,
        company_address_number,
        average_monthly_ads_investment,
        how_meet_us,
      ]);

    const accountId = insertAccountQuery.rows[0].id;

    await client.query(`DELETE FROM adfinance.account_temp WHERE email = '${email}'`);

    if (ads) {
      const insertAdsQuery = await client.query(`
      INSERT INTO
        adfinance.advertising_account (account_id, method, name, email, customer_account_id, access_token)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING
        id`,
        [
          accountId,
          ads.method,
          ads.name,
          ads.email,
          ads.customer_account_id,
          ads.access_token,
        ]);

      const advertisingAccountId = insertAdsQuery.rows[0].id;

      adsQuery = ads.evaluation.forEach(async campaign => {
        await client.query(`
        INSERT INTO
          adfinance.campaign (
            advertising_account_id,
            campaign_id,
            name,
            status,
            type,
            date,
            clicks,
            impressions,
            ctr,
            cost,
            average_cpc,
            absolute_top_impression_percentage,
            top_impression_percentage,
            conversions,
            view_through_conversions,
            cost_per_conversion,
            conversion_rate,
            average_cpm
          )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [
            advertisingAccountId,
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.type,
            campaign.date,
            campaign.metrics.clicks,
            campaign.metrics.impressions,
            campaign.metrics.ctr,
            campaign.metrics.cost,
            campaign.metrics.averageCpc,
            campaign.metrics.absoluteTopImpressionPercentage,
            campaign.metrics.topImpressionPercentage,
            campaign.metrics.conversions,
            campaign.metrics.viewThroughConversions,
            campaign.metrics.costPerConversions,
            campaign.metrics.conversionsRate,
            campaign.metrics.averageCpm,
          ]);
      });
    }

    if (analytics) {
      const insertAnalyticsQuery = await client.query(`
      INSERT INTO
        adfinance.analytic_account (account_id, method, name, email, view_id, access_token)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING
        id`,
        [
          accountId,
          analytics.method,
          analytics.name,
          analytics.email,
          analytics.view_id,
          analytics.access_token,
        ]);

      const analyticsAccountId = insertAnalyticsQuery.rows[0].id;

      analyticsQuery = analytics.evaluation.forEach(async analytic => {
        await client.query(`
        INSERT INTO
          adfinance.analytic (
            analytic_account_id,
            channel_group,
            date,
            goal_value_all,
            goal_completions_all,
            goal_conversion_rate_all
          )
        VALUES
          ($1, $2, $3, $4, $5, $6)`,
          [
            analyticsAccountId,
            analytic.channelGroup,
            analytic.date,
            analytic.metrics.goalValueAll,
            analytic.metrics.goalCompletionsAll,
            analytic.metrics.goalConversionRateAll,
          ]);
      });
    }

    if (payments) {
      const insertPaymentQuery = await client.query(`
      INSERT INTO
        adfinance.payment_account (account_id, method, credit, debit, access_token)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        id`,
        [
          accountId,
          payments.method,
          payments.evaluation ? payments.evaluation.summary.credit : 0,
          payments.evaluation ? payments.evaluation.summary.debit : 0,
          payments.access_token,
        ]);

      const paymentsAccountId = insertPaymentQuery.rows[0].id;

      if (payments.evaluation) {
        paymentsQuery = payments.evaluation.detail.forEach(async payment => {
          await client.query(`
          INSERT INTO
            adfinance.payment_grouped (
              payment_account_id,
              amount,
              description,
              type,
              date          
            )
          VALUES
            ($1, $2, $3, $4, $5)`,
            [
              paymentsAccountId,
              payment.amount,
              payment.description,
              payment.type,
              payment.date,
            ]);
        });
      }
    }

    await Promise.all([adsQuery, analyticsQuery, paymentsQuery]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const update = async ({
  how_meet_us,
  firstname,
  lastname,
  email,
  phone,
  role,
  company_name,
  company_id,
  website,
  monthly_gross_revenue,
  corporate_name,
  company_category,
  company_zip,
  company_address_number,
  average_monthly_ads_investment,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      UPDATE adfinance.account SET
        first_name = $1,
        last_name = $2,
        email = $3,
        phone = $4,
        role = $5,
        company_name = $6,
        website = $7,
        monthly_gross_revenue = $8,
        corporate_name = $9,
        company_category = $10,
        company_zip = $11,
        company_address_number = $12,
        average_monthly_ads_investment = $13,
        how_meet_us = $14
      WHERE company_id = $15`,
      [
        firstname,
        lastname,
        email,
        phone,
        role,
        company_name,
        website,
        monthly_gross_revenue,
        corporate_name,
        company_category,
        company_zip,
        company_address_number,
        average_monthly_ads_investment,
        how_meet_us,
        company_id,
      ]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const upload = async ({
  company_id,
  path,
  method,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const accounts = await client.query(`SELECT * FROM adfinance.account WHERE company_id = $1`, [company_id]);

    const lastAccount = accounts.rows[accounts.rows.length - 1];
    const account_id = lastAccount && lastAccount.id;

    if (account_id) {
      await client.query(`
      INSERT INTO
        adfinance.uploads (
          account_id,
          path,
          method
        )
      VALUES
        ($1, $2, $3)`,
        [
          account_id,
          path,
          method,
        ]);
    } else {
      throw new Error('Essa empresa não possui solicitações.');
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const uploads = async ({ company_id }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const accounts = await client.query(`SELECT * FROM adfinance.account WHERE company_id = $1`, [company_id]);

    const lastAccount = accounts.rows[accounts.rows.length - 1];
    const account_id = lastAccount && lastAccount.id;

    let uploads = { rows: [] }; 
    
    if (account_id) {
      uploads = await client.query(`SELECT * FROM adfinance.uploads WHERE account_id = $1`, [account_id]);
    }

    return uploads.rows;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const adsEvaluation = async ({ company_id, ads }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const accounts = await client.query(`SELECT * FROM adfinance.account WHERE company_id = $1`, [company_id]);

    const lastAccount = accounts.rows[accounts.rows.length - 1];
    const account_id = lastAccount && lastAccount.id;

    let adsQuery;
    
    const insertAdsQuery = await client.query(`
    INSERT INTO
      adfinance.advertising_account (account_id, method, name, email, customer_account_id, access_token)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING
      id`,
      [
        account_id,
        ads.method,
        ads.name,
        ads.email,
        ads.customer_account_id,
        ads.access_token,
      ]);

    const advertisingAccountId = insertAdsQuery.rows[0].id;

    adsQuery = ads.evaluation.forEach(async campaign => {
      await client.query(`
      INSERT INTO
        adfinance.campaign (
          advertising_account_id,
          campaign_id,
          name,
          status,
          type,
          date,
          clicks,
          impressions,
          ctr,
          cost,
          average_cpc,
          absolute_top_impression_percentage,
          top_impression_percentage,
          conversions,
          view_through_conversions,
          cost_per_conversion,
          conversion_rate,
          average_cpm
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          advertisingAccountId,
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.type,
          campaign.date,
          campaign.metrics.clicks,
          campaign.metrics.impressions,
          campaign.metrics.ctr,
          campaign.metrics.cost,
          campaign.metrics.averageCpc,
          campaign.metrics.absoluteTopImpressionPercentage,
          campaign.metrics.topImpressionPercentage,
          campaign.metrics.conversions,
          campaign.metrics.viewThroughConversions,
          campaign.metrics.costPerConversions,
          campaign.metrics.conversionsRate,
          campaign.metrics.averageCpm,
        ]);
    });

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

const registerTemporaryAccount = async ({
  firstname,
  lastname,
  email,
  phone,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      INSERT INTO
        adfinance.account_temp (first_name, last_name, email, phone)
      VALUES
        ($1, $2, $3, $4)`,
      [firstname, lastname, email, phone]
    );

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = {
  register,
  update,
  upload,
  uploads,
  adsEvaluation,
  registerTemporaryAccount,
};
