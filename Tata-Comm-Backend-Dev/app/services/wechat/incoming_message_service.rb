# ref : https://developers.wechat.biz/en/docs/messaging-api/receiving-messages/#webhook-event-types
# https://developers.wechat.biz/en/reference/messaging-api/#message-event

class Wechat::IncomingMessageService
  include ::FileTypeHelper
  pattr_initialize [:inbox!, :params!]

  def perform
    # probably test events
    return if params[:events].blank?

    wechat_contact_info
    return if wechat_contact_info['userId'].blank?

    set_contact
    set_conversation
    parse_events
  end

  private

  def parse_events
    params[:events].each do |event|
      next unless message_created? event

      attach_files event['message']
    end
  end

  def message_created?(event)
    return unless event_type_message?(event)

    @message = @conversation.messages.create(
      content: event['message']['text'],
      account_id: @inbox.account_id,
      inbox_id: @inbox.id,
      message_type: :incoming,
      sender: @contact,
      source_id: event['message']['id'].to_s
    )
    @message
  end

  def attach_files(message)
    return unless message_type_non_text?(message['type'])

    response = inbox.channel.client.get_message_content(message['id'])

    file_name = "media-#{message['id']}.#{response.content_type.split('/')[1]}"
    temp_file = Tempfile.new(file_name)
    temp_file.binmode
    temp_file << response.body
    temp_file.rewind

    @message.attachments.new(
      account_id: @message.account_id,
      file_type: file_content_type(response),
      file: {
        io: temp_file,
        filename: file_name,
        content_type: response.content_type
      }
    )
    @message.save!
  end

  def event_type_message?(event)
    event['type'] == 'message'
  end

  def message_type_non_text?(type)
    [Wechat::Bot::Event::MessageType::Video, Wechat::Bot::Event::MessageType::Audio, Wechat::Bot::Event::MessageType::Image].include?(type)
  end

  def account
    @account ||= inbox.account
  end

  def wechat_contact_info
    @wechat_contact_info ||= JSON.parse(inbox.channel.client.get_profile(params[:events].first['source']['userId']).body)
  end

  def set_contact
    contact_inbox = ::ContactBuilder.new(
      source_id: wechat_contact_info['userId'],
      inbox: inbox,
      contact_attributes: contact_attributes
    ).perform

    @contact_inbox = contact_inbox
    @contact = contact_inbox.contact
  end

  def conversation_params
    {
      account_id: @inbox.account_id,
      inbox_id: @inbox.id,
      contact_id: @contact.id,
      contact_inbox_id: @contact_inbox.id
    }
  end

  def set_conversation
    @conversation = @contact_inbox.conversations.first
    return if @conversation

    @conversation = ::Conversation.create!(conversation_params)
  end

  def contact_attributes
    {
      name: wechat_contact_info['displayName'],
      avatar_url: wechat_contact_info['pictureUrl']
    }
  end

  def file_content_type(file_content)
    file_type(file_content.content_type)
  end
end
