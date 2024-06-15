# https://docs.360dialog.com/whatsapp-api/whatsapp-api/media
# https://developers.facebook.com/docs/whatsapp/api/media/

class Whatsapp::IncomingMessageServiceMeta
  pattr_initialize [:inbox!, :params!]

  def perform
    Rails.logger.info "@@Whatsapp::IncomingMessageServiceMeta@@@  #{params}"
    set_contact
    if(!@contact)
      # update the status of messages table record
      # Messages.where(contact_id: @mergee_contact.id).update(contact_id: @base_contact.id)
      # Message.where(source_id: params["statuses"].first['id']).update(status: params["statuses"].first['status']
      response_update = Message.where(source_id: params["statuses"].first['id']).update(status: params["statuses"].first['status'])
      Rails.logger.info response_update
    end
    return unless @contact
    set_conversation
    
    return if params[:messages].blank?
     @message = @conversation.messages.build(
      content: message_content(params[:messages].first),
      account_id: @inbox.account_id,
      inbox_id: @inbox.id,
      message_type: :incoming,
      sender: @contact,
      source_id: params[:messages].first[:id].to_s
    )
    attach_files

    message_type = params[:messages].first[:type]

    if %w[contacts location].include?(message_type)
      @message.content = get_content_json(message_type, params[:messages].first)
      @message.content_type = message_type
      #@message.content_attributes = get_content_json(params[:messages].first)
    end

    

    @message.save!
    #mark message as read to whatsapp for TATA
    inbox.channel.mark_message_read(params[:messages].first[:id].to_s,"TATA");

  end

  private

  def get_content_json(message_type, message_param)
    #params[:messages].first
    #Rails.logger.info message_param
    content_object = {"type": message_type}
    content_object[message_type] = message_param[message_type]
    Rails.logger.info content_object
    return content_object.stringify_keys
  end

  def message_content(message)
    # TODO: map interactive messages back to button messages in tring
    Rails.logger.info "@@Whatsapp::IncomingMessageServiceMeta@@@ message_content #{message}"
    message.dig(:text, :body) ||
      message.dig(:button, :text) ||
      message.dig(:interactive, :button_reply, :title) ||
      message.dig(:interactive, :list_reply, :title) 
  end

  def account
    @account ||= inbox.account
  end

  def set_contact
    contact_params = params[:contacts]&.first
    return if contact_params.blank?

    contact_inbox = ::ContactBuilder.new(
      source_id: contact_params[:wa_id],
      inbox: inbox,
      contact_attributes: { name: contact_params.dig(:profile, :name), phone_number: "+#{params[:messages].first[:from]}" }
    ).perform

    @contact_inbox = contact_inbox
    @contact = contact_inbox.contact
  end

  def conversation_params
    {
      account_id: @inbox.account_id,
      inbox_id: @inbox.id,
      contact_id: @contact.id,
      contact_inbox_id: @contact_inbox.id,
      channel_id: @inbox.channel_id,
      channel_type: @inbox.channel_type
    }
  end

  def set_conversation
    @conversation = @contact_inbox.conversations.last
    # return if @conversation
    if @conversation
      if @conversation.status == "resolved"
        @conversation = ::Conversation.create!(conversation_params)
      end
      return
    end

    @conversation = ::Conversation.create!(conversation_params)
  end

  def file_content_type(file_type)
    Rails.logger.info "@@Whatsapp::IncomingMessageServiceMeta@@@ file_content_type #{file_type}"
    return :image if %w[image sticker].include?(file_type)
    return :audio if %w[audio voice].include?(file_type)
    return :video if ['video'].include?(file_type)

    :file
  end

  def attach_files_old
    message_type = params[:messages].first[:type]
    return if %w[text button interactive].include?(message_type)

    attachment_payload = params[:messages].first[message_type.to_sym]

    url = "https://graph.facebook.com/v15.0/#{attachment_payload[:id]}"

    attachment_file = Down.download(inbox.channel.media_url(attachment_payload[:id]), headers: inbox.channel.api_headers)
    #attachment_file = Down.download(url, headers: inbox.channel.api_headers_meta)

    @message.content ||= attachment_payload[:caption]
    @message.attachments.new(
      account_id: @message.account_id,
      file_type: file_content_type(message_type),
      file: {
        io: attachment_file,
        filename: attachment_file,
        content_type: attachment_file.content_type
      }
    )
  end

  def attach_files
    message_type = params[:messages].first[:type]
    return if %w[text button interactive contacts location].include?(message_type)

    attachment_payload = params[:messages].first[message_type.to_sym]

    attachment_info = inbox.channel.get_attachment_info(attachment_payload[:id])

    if attachment_info && attachment_info['url']

      # attachment_file = Down.download(inbox.channel.get_url_attachment_info(attachment_info['url']), headers: inbox.channel.get_api_headers)
      attachment_file = Down.download(attachment_info['url'], headers: inbox.channel.api_headers_meta)


      @message.content ||= attachment_payload[:caption]

      @message.attachments.new(
        account_id: @message.account_id,
        file_type: file_content_type(message_type),
        file: {
          io: attachment_file,
          filename: attachment_file.original_filename,
          content_type: attachment_file.content_type
        }
      )
    end
  end
end
