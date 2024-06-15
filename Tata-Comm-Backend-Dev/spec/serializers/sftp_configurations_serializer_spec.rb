require 'rails_helper'

RSpec.describe Sftp::SftpConfigurationsSerializer do
  subject { JSON.parse(serialization.to_json) }

  let(:account) { create(:account) }
  let(:sftp_configuration) { create(:sftp_configuration, account: account) }
  let(:serialization) { ActiveModelSerializers::SerializableResource.new(sftp_configuration, serializer: described_class) }

  describe '#as_json' do
    let(:result) { subject.as_json.delete_if { |key| key == 'updated_at' } }

    it 'includes the expected attributes' do
      expect(result.keys)
        .to contain_exactly(
          'id',
          'hostname',
          'username',
          'password',
          'folder_path',
          'is_encrypted',
          'decryption_key',
          'created_at',
          'account_id'
        )
    end
  end
end
