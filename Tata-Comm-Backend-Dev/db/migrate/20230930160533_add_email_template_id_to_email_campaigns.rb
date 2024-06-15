class AddEmailTemplateIdToEmailCampaigns < ActiveRecord::Migration[6.1]
    def change
      add_column :email_campaigns, :email_template_id, :integer, null: true
    end
  end
  