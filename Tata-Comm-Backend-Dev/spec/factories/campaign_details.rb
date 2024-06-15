# frozen_string_literal: true
FactoryBot.define do
  factory :campaign_detail, class: 'Campaign::CampaignDetail' do
    subject {'Let Your Summer Look Shine!'}
    sender_name {'Test User'}
    from_email_address {'test@example.com'}
		reply_to_email_address {'test@example.com'}
		preview_text {'Summer Sale - Infuse freshness in your wardrobe with our latest offerings.'}
		cc_email_address {'test_user@example.com, user@example.com'}
		bcc_email_address {'test_user1@example.com, user1@example.com'}
    after(:build) do |campaign_detail|
      campaign_detail.account ||= create(:account)
    end
		after(:build) do |campaign_detail|
      campaign_detail.campaign ||= create(:campaign)
    end
		after(:build) do |campaign_detail|
      campaign_detail.email_channel ||= create(:email_channel)
    end
  end
end
