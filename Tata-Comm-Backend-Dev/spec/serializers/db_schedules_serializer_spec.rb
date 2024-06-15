require 'rails_helper'

RSpec.describe Db::DbSchedulesSerializer do
  subject { JSON.parse(serialization.to_json) }

  let(:account) { create(:account) }
  let(:db_configuration) { create(:db_configuration, account: account) }
  let(:db_schedule_detail) { create(:db_schedule_detail, source_id: db_configuration.id, account_id: account.id) }
  let(:serialization) { ActiveModelSerializers::SerializableResource.new(db_schedule_detail, serializer: described_class) }

  describe '#as_json' do
    let(:result) { subject.as_json.delete_if { |key| key == 'updated_at' } }

    it 'includes the expected attributes' do
      expect(result.keys)
        .to contain_exactly(
          'id',
          'import_name',
          'frequency',
          'end_type',
          'occurrences',
          'schedule_type',
          'segment_name',
          'connection_name',
          'source_type',
          'source_id',
          'status',
          'table_name',
          'time_zone',
          'import_type',
          'email_ids',
          'start_date',
          'end_date',
          'deactivate',
          'events_name',
          'repeat_on_day_of_month',
          'repeat_on_day_of_week',
          'cron_expression',
          'occurrence_count',
          'repeat_every',
          'run_at',
          'next_run_at',
          'created_at'
        )
    end
  end
end
