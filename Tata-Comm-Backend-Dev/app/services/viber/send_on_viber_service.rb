class Viber::SendOnViberService < Base::SendOnChannelService
  private

  def channel_class
    Channel::Viber
  end

  def perform_reply
    channel.client.push_message(message.conversation.contact_inbox.source_id, [{ type: 'text', text: message.content }])
  end
end
