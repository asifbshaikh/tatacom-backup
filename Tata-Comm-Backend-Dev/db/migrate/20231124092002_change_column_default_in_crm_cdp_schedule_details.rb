class ChangeColumnDefaultInCrmCdpScheduleDetails < ActiveRecord::Migration[6.1]
  def change
    change_column_default :crm_cdp_schedule_details, :occurrence_count, 0
  end
end
