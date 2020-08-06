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
  created_on timestamp with time zone default current_timestamp
);

create table adfinance.advertising_account(
  id serial primary key,
  account_id integer references adfinance.account (id) not null,
  platform varchar (50) not null,
  customer_account_id varchar (50) not null,
  access_token varchar (255) not null,
  created_on timestamp with time zone default current_timestamp
);

create table adfinance.campaign(
  id serial primary key,
  campaign_id integer not null,
  advertising_account_id integer references adfinance.advertising_account (id) not null,
  name varchar (255) not null,
  status varchar (20) not null,
  type varchar (55) not null,
  date date not null,
  clicks integer default 0,
  impressions integer default 0,
  ctr varchar (7) default '0%',
  cost integer default 0,
  average_cpc integer default 0,
  absolute_top_impression_percentage decimal (11,2) default 0,
  top_impression_percentage decimal (11,2) default 0,
  conversions decimal (11,2) default 0,
  view_through_conversions integer default 0,
  cost_per_conversion integer default 0,
  conversion_rate varchar (7) default '0%',
  average_cpm integer default 0,
  created_on timestamp with time zone default current_timestamp
);

create table adfinance.analytic_account(
  id serial primary key,
  account_id integer references adfinance.account (id) not null,
  platform varchar (50) not null,
  view_id varchar (50) not null,
  access_token varchar (255) not null,
  created_on timestamp with time zone default current_timestamp
);

create table adfinance.analytic(
  id serial primary key,
  analytic_account_id integer references adfinance.analytic_account (id) not null,
  channel_group varchar (55) not null,
  date date not null,
  goal_value_all decimal (11,2) default 0,
  goal_completions_all integer default 0,
  goal_conversion_rate_all varchar (7) default '0%'
);

create table adfinance.payment_account(
  id serial primary key,
  account_id integer references adfinance.account (id) not null,
  platform varchar (50) not null,
  access_token varchar (255) not null,
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