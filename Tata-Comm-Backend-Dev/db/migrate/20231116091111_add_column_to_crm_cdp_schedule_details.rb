class AddColumnToCrmCdpScheduleDetails < ActiveRecord::Migration[6.1]
  def change
    add_column :crm_cdp_schedule_details, :type, :string
    add_column :crm_cdp_schedule_details, :import_type, :string
    add_column :crm_cdp_schedule_details, :email_ids, :jsonb, array: true, default: []
    add_column :crm_cdp_schedule_details, :end_date, :datetime
    add_column :crm_cdp_schedule_details, :repetition, :string
  end
end
