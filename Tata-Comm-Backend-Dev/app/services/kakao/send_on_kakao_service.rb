class Kakao::SendOnKakaoService < Base::SendOnChannelService
  private

  def channel_class
    Channel::Kakao
  end

  def perform_reply
    channel.client.push_message(message.conversation.contact_inbox.source_id, [{ type: 'text', text: message.content }])
  end
end
