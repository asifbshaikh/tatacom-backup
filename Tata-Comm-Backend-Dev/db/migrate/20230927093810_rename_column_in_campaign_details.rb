class RenameColumnInCampaignDetails < ActiveRecord::Migration[6.1]
  # changing null: false to null: true for column as it will not save record in case of save as draft
  def up
    change_column_null :campaign_details, :subject, true
    change_column_null :campaign_details, :sender_name, true
    change_column_null :campaign_details, :from_email_address, true
    change_column_null :campaign_details, :reply_to_email_address, true
  end

  def down
    change_column_null :campaign_details, :subject, false
    change_column_null :campaign_details, :sender_name, false
    change_column_null :campaign_details, :from_email_address, false
    change_column_null :campaign_details, :reply_to_email_address, false
  end
end
