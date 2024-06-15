# frozen_string_literal: true

FactoryBot.define do
  factory :channel_email, class: 'Channel::Email' do
    smtp_address { Faker::Internet.domain_name }
    email_api_url { Faker::Internet.url }
    email_api_key { Faker::Alphanumeric.alphanumeric(number: 20) }
    sequence(:email) { |n| "care-#{n}@example.com" }
    sequence(:forward_to_email) { |n| "forward-#{n}@tring.com" }
    account
    after(:create) do |channel_email|
      create(:inbox, channel: channel_email, account: channel_email.account)
    end
  end
end
