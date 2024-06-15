class Webhooks::AccountEmailDeliveryJob < ApplicationJob
  queue_as :default

  def perform
    Account.all.each do |account|
      Webhooks::EmailCampaignDeliveryWorker.perform_later({'account_id': account.id})
    end
  end
end