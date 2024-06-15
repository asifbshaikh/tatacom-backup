# frozen_string_literal: true

FactoryBot.define do
    factory :email_campaign, class: 'Campaign::EmailCampaign' do
      account
      template
      after(:create) do |email_campaign|
        create(:campaign, campaignable: email_campaign)
      end
    end
  end
  