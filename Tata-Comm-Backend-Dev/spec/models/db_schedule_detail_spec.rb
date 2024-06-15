require 'rails_helper'

RSpec.describe DbScheduleDetail do
  let(:account) { create(:account) }
  let(:db_configuration) { create(:db_configuration, account: account) }
  let(:db_schedule_detail) { create(:db_schedule_detail, account: account, source_id: db_configuration.id) }

  context 'validate associations' do
    it { is_expected.to belong_to(:account) }
  end

  describe '.validations' do
    it { is_expected.to validate_presence_of(:import_type) }
    it { is_expected.to validate_presence_of(:table_name) }
    it { is_expected.to validate_uniqueness_of(:import_name).scoped_to(:account_id).case_insensitive }
  end

  context 'validate instance methods' do
    it 'returns true if schedule type is as_soon_as_possible else returns false' do
      expect(db_schedule_detail.asap?).to be(true)
      db_schedule_detail.schedule_type = 'periodic'
      expect(db_schedule_detail.asap?).to be(false)
    end

    it 'returns true if schedule type is at_specific_time else returns false' do
      expect(db_schedule_detail.at_specific_time?).to be(false) # return false as currently the schedule type is 'as_soon_as_possible'
      db_schedule_detail.schedule_type = 'at_specific_time'
      expect(db_schedule_detail.at_specific_time?).to be(true)
    end
  end
end
