require 'rails_helper'

RSpec.describe DataSyncImport do
  let(:account) { create(:account) }
  let(:db_configuration) { create(:db_configuration, account: account) }
  let(:db_schedule_detail) { create(:db_schedule_detail, account: account, source_id: db_configuration.id) }
  let(:data_sync_import) { create(:data_sync_import, account: account, crm_cdp_schedule_detail_id: db_schedule_detail.id) }

  context 'validate associations' do
    it { is_expected.to belong_to(:account) }
    it { is_expected.to belong_to(:crm_cdp_schedule_detail) }
    it { is_expected.to have_many(:contacts) }
  end
end
