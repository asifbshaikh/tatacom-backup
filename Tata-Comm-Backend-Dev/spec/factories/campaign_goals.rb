FactoryBot.define do
  factory :campaign_goal do
    association :account
    association :campaign
    name { 'MyString' }
  end
end
