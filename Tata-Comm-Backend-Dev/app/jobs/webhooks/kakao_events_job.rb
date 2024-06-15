class Webhooks::KakaoEventsJob < ApplicationJob
  queue_as :default

  def perform(params = {})
    return unless params[:appid]

    channel = Channel::Kakao.find_by(bot_token: params[:appid])
    return unless channel

    Kakao::IncomingMessageService.new(inbox: channel.inbox, params: params[appid].with_indifferent_access).perform
  end
end
