'use strict';

const pool = require('../../config/pool');

const register = async ({
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
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let adsQuery, analyticsQuery;

    const isAlreadyUserQuery = await client.query(`SELECT id FROM adfinance.account WHERE email = $1`, [email]);

    const hasUser = isAlreadyUserQuery.rows.length > 0;

    if (hasUser) {
      throw new Error('E-mail já cadastrado.');
    }

    const insertAccountQuery = await client.query(`
    INSERT INTO
      adfinance.account (first_name, last_name, email, phone, role, company_name, company_id, website, monthly_gross_revenue)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING
      id`,
      [firstname, lastname, email, phone, role, company_name, company_id, website, monthly_gross_revenue]);

    const accountId = insertAccountQuery.rows[0].id;

    if (ads) {
      const insertAdsQuery = await client.query(`
      INSERT INTO
        adfinance.advertising_account (account_id, platform, customer_account_id, access_token)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id`,
        [accountId, ads.method, ads.customer_account_id, ads.access_token]);

      const advertisingAccountId = insertAdsQuery.rows[0].id;

      adsQuery = ads.evaluation.forEach(async campaign => {
        await client.query(`
        INSERT INTO
          adfinance.campaign (
            advertising_account_id,
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
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING
          id`,
          [
            advertisingAccountId,
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
        adfinance.analytic_account (account_id, platform, view_id, access_token)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id`,
        [accountId, analytics.method, analytics.view_id, analytics.access_token]);

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
          ($1, $2, $3, $4, $5, $6)
        RETURNING
          id`,
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

    await Promise.all([adsQuery, analyticsQuery]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = register;