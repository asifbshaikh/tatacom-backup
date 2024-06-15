# must run scripts/contact.rb and scripts/common_event.rb script files before running this script
require 'benchmark'
Benchmark.bmbm do |obj|
  obj.report('ContactCommonEvent runtime') do
    Contact.pluck(:id).each do |contact_id|
      num = rand(1..5)
      CommonEvent.limit(num).pluck(:id).each do |common_event_id|
        rand(1..4).times do
          ContactCommonEvent.create!(
            contact_id: contact_id,
            common_event_id: common_event_id,
            campaign_id: Campaign.active.pluck(:id).sample,
            campaign_name: Campaign.active.pluck(:title).sample,
            campaign_type: [
              'Campaign::SmsCampaign',
              'Campaign::EmailCampaign',
              'Campaign::WhatsappCampaign'
            ].sample,
            campaign_channel: [
              'Channel::TataSmsc',
              'Channel::Email',
              'Channel::Whatsapp'
            ].sample,
            created_at: [
              rand(12).month.ago,
              rand(366).days.ago,
              rand(10).years.ago,
              Time.zone.now
            ].sample,
            updated_at: [
              rand(12).month.ago,
              rand(366).days.ago,
              rand(10).years.ago,
              Time.zone.now
            ].sample
          )
        end
      end
    end
  end
end
