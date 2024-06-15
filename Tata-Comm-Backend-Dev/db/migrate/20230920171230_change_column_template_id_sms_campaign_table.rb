class ChangeColumnTemplateIdSmsCampaignTable < ActiveRecord::Migration[6.1]
  def change
    change_column :sms_campaigns, :template_id, :string
  end
end
