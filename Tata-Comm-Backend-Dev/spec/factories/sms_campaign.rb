# frozen_string_literal: true

FactoryBot.define do
    factory :campaign_sms_campaign, class: 'Campaign::SmsCampaign' do
      account
      template
      after(:create) do |campaign_sms_campaign|
        create(:campaign, campaignable: campaign_sms_campaign)
      end
    end
  end
  