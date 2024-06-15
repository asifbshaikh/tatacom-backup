class Webhooks::ViberEventsJob < ApplicationJob
  queue_as :default

  def perform(params = {})
    return unless params[:service_id]

    channel = Channel::Viber.find_by(bot_token: params[:service_id])
    return unless channel

    Viber::IncomingMessageService.new(inbox: channel.inbox, params: params[:service_id].with_indifferent_access).perform
  end
end
