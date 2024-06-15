require 'rails_helper'

RSpec.describe NotificationChannel, type: :model do
  describe 'validations' do
    let(:account) { create(:account) }

    it 'validates configuration for apns_authentication_key' do
      channel = build(:notification_channel, account: account)
      expect(channel).to be_valid
    end

    it 'validates configuration for apns_provider_certificate' do
      channel = build(:notification_channel, :with_apns_authentication_key)
      expect(channel).to be_valid
    end

    it 'does not validate configuration for an invalid type' do
      channel = build(:notification_channel, configuration: { 'config_type' => 'invalid_type' })
      expect(channel).not_to be_valid
    end

    it 'does not validate configuration without required keys' do
      channel = build(:notification_channel, :with_apns_authentication_key, configuration: {})
      expect(channel).not_to be_valid
    end
  end
end