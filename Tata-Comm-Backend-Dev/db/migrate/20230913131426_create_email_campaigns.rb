class CreateEmailCampaigns < ActiveRecord::Migration[6.1]
  def change
    create_table :email_campaigns do |t|
      t.references :account,                             null: false,  foreign_key: true,       index: true
      t.references :campaign_tag,                        null: true,   foreign_key: true,       index: true
      t.integer    :campaign_content_type,               null: false,  default: 0,              index: true
      t.string     :user_attribute_with_email_address,   null: true
      t.timestamps
    end

    create_table :campaign_details do |t|
      t.text       :subject,                            null: false
      t.text       :preview_text
      t.string     :sender_name,                        null: false
      t.string     :from_email_address,                 null: false,  index: true
      t.string     :reply_to_email_address,             null: false,  index: true
      t.string     :cc_email_address,                                 array: true, default: []
      t.string     :bcc_email_address,                                array: true, default: []
      t.references :account,                            null: false,  foreign_key: true,        index: true
      t.references :campaign,                           null: false,  foreign_key: true,        index: true
      t.integer    :channel_email_id,                   null: true,   foreign_key: true,        index: true
      t.timestamps
    end
  end

  # changing null: false to null: true for message column as it will not be present for all campaign on model level we can validate it
  def up
    change_column_null :campaigns, :message, true
  end
  
  def down
    change_column_null :campaigns, :message, false
  end
end
