require 'rails_helper'

RSpec.describe Db::DataSyncImportsSerializer do
  subject { JSON.parse(serialization.to_json) }

  let(:account) { create(:account) }
  let(:db_configuration) { create(:db_configuration, account: account) }
  let(:db_schedule_detail) { create(:db_schedule_detail, source_id: db_configuration.id, account_id: account.id) }
  let(:data_sync_import) { create(:data_sync_import, account: account, crm_cdp_schedule_detail_id: db_schedule_detail.id) }
  let(:serialization) { ActiveModelSerializers::SerializableResource.new(data_sync_import, serializer: described_class) }

  describe '#as_json' do
    let(:result) { subject.as_json.delete_if { |key| key == 'updated_at' } }

    it 'includes the expected attributes' do
      expect(result.keys)
        .to contain_exactly(
          'id',
          'name',
          'folder_path',
          'processed_count',
          'synced_count',
          'import_type',
          'status',
          'file_key',
          'failed_error',
          'segment_name',
          'total_rows',
          'processed_rows',
          'crm_cdp_schedule_detail_id',
          'account_id',
          'created_at'
        )
    end
  end
end
