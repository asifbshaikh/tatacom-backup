class AddCampaignInTinyUrls < ActiveRecord::Migration[6.1]
  def change
    add_column :sms_campaigns, :tiny_urls, :text, array: true, default: []
  end
end
