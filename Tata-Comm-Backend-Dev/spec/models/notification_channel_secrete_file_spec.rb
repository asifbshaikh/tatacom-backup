require 'rails_helper'

RSpec.describe NotificationChannelSecreteFile, type: :model do
  let(:notification_channel) { create(:notification_channel) }
  let(:file_params) { fixture_file_upload('private_key.json', 'application/p') }
  let(:notification_channel_secrete_file) do
    create(:notification_channel_secrete_file, notification_channel: notification_channel)
  end

  describe 'validations' do
    context 'custom validations' do
      let(:account) { create(:account) }
      let(:notification_channel) { create(:notification_channel, account: account) }

      it 'validates channel_secret_file presence' do
        secrete_file = build(:notification_channel_secrete_file, notification_channel: notification_channel)
        expect(secrete_file).not_to be_valid
        expect(secrete_file.errors[:channel_secret_file]).to include("must be present")
      end

      it 'validates file_extension matches configuration' do
        secrete_file = build(:notification_channel_secrete_file, notification_channel: notification_channel)
        secrete_file.channel_secret_file.attach(io: StringIO.new('dummy content'), filename: 'dummy.txt')
        expect(secrete_file).not_to be_valid
      end
    end
  end

  describe 'methods' do
    let(:notification_channel) { create(:notification_channel) }

    describe '.find_or_initialize_by_params' do
      it 'finds or initializes a secrete file by params' do
        secrete_file = described_class.find_or_initialize_by_params(notification_channel.id, 'mobile')
        expect(secrete_file).to be_a_new(described_class)
        expect(secrete_file.notification_channel_id).to eq(notification_channel.id)
      end
    end

    describe '.create_with_params' do
      it 'creates a secrete file with params' do
        file_params = fixture_file_upload('private_key.json', 'application/json')
        attributes = { notification_channel_id: notification_channel.id, device: 'mobile', file_type: 'private_key_file' }

        secrete_file = described_class.create_with_params(file_params, attributes)

        expect(secrete_file).to be_persisted
        expect(secrete_file.channel_secret_file).to be_attached
        expect(secrete_file.file_extension).to eq('.json')
        expect(secrete_file.device).to eq('mobile')
      end
    end

    describe '#config_type_to_extension' do
      it 'returns the expected file extension based on config_type' do
        secrete_file = build(:notification_channel_secrete_file, notification_channel: notification_channel, file_type: 'private_key_file')
        expect(secrete_file.config_type_to_extension('private_key_file')).to eq('.json')
      end

      it 'raises an error for an invalid config_type' do
        secrete_file = build(:notification_channel_secrete_file, notification_channel: notification_channel, file_type: 'invalid_type')
        expect { secrete_file.config_type_to_extension('invalid_type') }.to raise_error("Invalid file")
      end
    end

    describe '#file_extension_matches?' do
      it 'returns true when file extension matches expected extension' do
        secrete_file = build(:notification_channel_secrete_file, file_extension: '.json')
        expect(secrete_file.file_extension_matches?('.json')).to be true
      end

      it 'returns false when file extension does not match expected extension' do
        secrete_file = build(:notification_channel_secrete_file, notification_channel: notification_channel, file_type: 'private_key_file')
        expect(secrete_file.file_extension_matches?('.p8')).to be false
      end
    end
  end
end