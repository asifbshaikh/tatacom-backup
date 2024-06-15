class UpdateDataInContactCommonEvents < ActiveRecord::Migration[6.1]
  def change
    ContactCommonEvent.where.not(campaign_type: nil, campaign_channel: nil).find_each do |event|
      channel = case event.campaign_channel
                when CHANNEL_WHATSAPP
                  "Whatsapp"
                when CHANNEL_SMS
                  "SMS"
                when CHANNEL_EMAIL
                  "Email"
                end

      campaign = Campaign.find(event.campaign_id.to_i)
      event.update(created_at: Time.now, updated_at: Time.now, campaign_channel: channel, campaign_type: (campaign.present? ? campaign.scheduling_type : nil))
    end
  end
end
