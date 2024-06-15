FactoryBot.define do
  factory :db_configuration do
    name { Faker::Name.first_name }
    adapter { %w[postgresql].sample }
    encoding { 'unicode' }
    host { 'crm-cdp-hdfc.cs36wjc4iyst.ap-south-1.rds.amazonaws.com' }
    username { 'crm_hdfc_user' }
    password { 'HDFC!1234!' }
    database { 'new_crm_database' }
    port { '5432' }
    account
  end
end
