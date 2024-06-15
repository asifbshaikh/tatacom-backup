FactoryBot.define do
  factory :campaign_delivery do
  	association :campaign
  	association :contact
  	association :account
  end
end