class Campaigns::TriggerOneoffCampaignJob < ApplicationJob
  queue_as :high

  def perform(campaign)
    campaign.trigger!
  end
end
