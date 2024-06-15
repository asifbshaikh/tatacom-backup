require 'rails_helper'

RSpec.describe Db::DbConfigurationsSerializer do
  subject { JSON.parse(serialization.to_json) }

  let(:account) { create(:account) }
  let(:db_configuration) { create(:db_configuration, account: account) }
  let(:serialization) { ActiveModelSerializers::SerializableResource.new(db_configuration, serializer: described_class) }

  describe '#as_json' do
    let(:result) { subject.as_json.delete_if { |key| key == 'updated_at' } }

    it 'includes the expected attributes' do
      expect(result.keys)
        .to contain_exactly(
          'id',
          'name',
          'adapter',
          'encoding',
          'host',
          'username',
          'password',
          'database',
          'port',
          'account_id',
          'created_at'
        )
    end
  end
end
