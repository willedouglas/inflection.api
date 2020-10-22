module.exports = `
create table adfinance.account(
  id serial primary key,
  first_name varchar (255) not null,
  last_name  varchar (255) not null,
  email varchar (255) not null,
  phone varchar (11),
  role varchar (50),
  company_name varchar (255) not null,
  company_id varchar (14) not null,
  website varchar (255),
  monthly_gross_revenue decimal (11,2),
  how_meet_us varchar (255) null,
  corporate_name varchar (255) null,
  company_category varchar (255) null,
  company_zip varchar (10) null,
  company_address_number varchar (255) null,
  average_monthly_ads_investment varchar (255) not null,
  bankly_proxy varchar(25) null,
  bankly_activation_code varchar(18) null,
  bankly_account_number varchar(10) null,
  created_on timestamp with time zone default current_timestamp
);

create table adfinance.advertising_account(
  id serial primary key,
  account_id integer references adfinance.account (id) not null,
  method varchar (50) not null,
  name  varchar (255),
  email varchar (255),
  customer_account_id varchar (50),
  access_token varchar (255),
  created_on timestamp with time zone default current_timestamp
);

create table adfinance.campaign(
  id serial primary key,
  campaign_id varchar (30) not null,
  advertising_account_id integer references adfinance.advertising_account (id) not null,
  name varchar (255) not null,
  status varchar (60) not null,
  type varchar (60) not null,
  date date not null,
  clicks varchar (50),
  impressions varchar (50),
  ctr varchar (50),
  cost varchar (50),
  average_cpc varchar (50),
  absolute_top_impression_percentage varchar (50),
  top_impression_percentage varchar (50),
  conversions varchar (50),
  view_through_conversions varchar (50),
  cost_per_conversion varchar (50),
  conversion_rate varchar (50),
  average_cpm varchar (50),
  created_on timestamp with time zone default current_timestamp
);

create table adfinance.analytic_account(
  id serial primary key,
  account_id integer references adfinance.account (id) not null,
  method varchar (50) not null,
  name  varchar (255),
  email varchar (255),
  view_id varchar (50),
  access_token varchar (255),
  created_on timestamp with time zone default current_timestamp
);

create table adfinance.analytic(
  id serial primary key,
  analytic_account_id integer references adfinance.analytic_account (id) not null,
  channel_group varchar (55) not null,
  date date not null,
  goal_value_all varchar (50),
  goal_completions_all varchar (50),
  goal_conversion_rate_all varchar (50),
  created_on timestamp with time zone default current_timestamp
);

create table adfinance.payment_account(
  id serial primary key,
  account_id integer references adfinance.account (id) not null,
  method varchar (50) not null,
  credit decimal (11,2),
  debit decimal (11,2),
  access_token varchar (255),
  created_on timestamp with time zone default current_timestamp
);

create table adfinance.payment_grouped(
  id serial primary key,
  payment_account_id integer references adfinance.payment_account (id) not null,
  amount decimal (11,2) default 0,
  description varchar (60) not null,
  type integer not null,
  date date not null,
  created_on timestamp with time zone default current_timestamp
);`
