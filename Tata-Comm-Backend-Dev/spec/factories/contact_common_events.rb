FactoryBot.define do
  factory :contact_common_event do
    app_version {Faker::App.version}
    campaign_channel {Faker::Lorem.word}
    campaign_name {Faker::Lorem.word}
    campaign_type {Faker::Lorem.word}
    platform {Faker::Lorem.word}
    sdk_version {Faker::App.semantic_version}
    campaign_id {Faker::Lorem.word}
    association :contact
    association :common_event
  end
end