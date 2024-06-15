class Webhooks::WechatEventsJob < ApplicationJob
  queue_as :default

  def perform(params = {})
    return unless params[:bot_token]

    channel = Channel::Wechat.find_by(bot_token: params[:bot_token])
    return unless channel

    Wechat::IncomingMessageService.new(inbox: channel.inbox, params: params[:bot_token].with_indifferent_access).perform
  end
end
