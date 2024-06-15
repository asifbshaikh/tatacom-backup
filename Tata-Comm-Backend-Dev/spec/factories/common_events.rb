FactoryBot.define do
  factory :common_event do
    category {'app_event'}
    data_type { 'string'}
    description { 'app common event'}
    displayed_name {'install'}
    name { 'install'}
    source { ['sdk'] }
    association :account
  end
end