require 'rails_helper'

RSpec.describe CrmCdpScheduleDetail do
  let(:account) { create(:account) }
  let(:db_configuration) { create(:db_configuration, account: account) }
  let(:crm_cdp_schedule_detail) { create(:crm_cdp_schedule_detail, account: account, source_id: db_configuration.id) }

  context 'validate associations' do
    it { is_expected.to belong_to(:account) }
    it { is_expected.to have_many(:data_sync_imports).dependent(:destroy_async) }
  end

  describe '.validations' do
    it { is_expected.to validate_presence_of(:source_type) }
    it { is_expected.to validate_presence_of(:source_id) }
    it { is_expected.to validate_presence_of(:import_name) }
    it { is_expected.to validate_presence_of(:schedule_type) }
  end
end
