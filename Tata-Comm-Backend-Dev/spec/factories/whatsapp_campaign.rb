# frozen_string_literal: true

FactoryBot.define do
    factory :whatsapp_campaign, class: 'Campaign::WhatsappCampaign' do
      account
      after(:create) do |whatsapp_campaign|
        create(:campaign, campaignable: whatsapp_campaign)
      end
    end
  end
  