class Tata::IncomingMessageService
  include ::FileTypeHelper

  pattr_initialize [:basic_auth!, :params!]

  def perform
    # Rails.logger.info "@@Whatsapp::IncomingMessageServiceMeta@@@  #{params}"
    # Rails.logger.info params
    if(params["id"] && params["status"])
      # update the status of messages table record
      statuses = {
        "DELIVERED": 'delivered',
        # "PENDING": 0,
        # "ENROUTE": 0,
        "EXPIRED": 'failed',
        # "DELETED": 0,
        # "UNKNOWN": 0,
        # "REJECTED": 0,
        "UNDELIVERED": 'failed',
        # "ACCEPTED": 0
      }
      return false if !statuses.key?(params["status"].to_sym)
      response_update = Message.where(source_id: params["id"]).update(status: statuses[params["status"].to_sym])
      return true
    end
    set_contact

    set_conversation
    @message = @conversation.messages.create(
      content: params[:msg],
      account_id: @inbox.account_id,
      inbox_id: @inbox.id,
      message_type: :incoming,
      sender: @contact,
      source_id: params[:SmsSid]
    )
    attach_files
  end

  private

  def getAppid
    @authraw = basic_auth.split(' ')
    @appid = Base64.decode64(@authraw[1])

    @appid.split(':')[0]
  end

  def tata_inbox
    appid = getAppid

    # @tata_inbox ||= ::Channel::Tata.find_by!(#suggestedfix
    @tata_inbox ||= ::Channel::ChannelTataSm.find_by!(
      appID: appid,
      phone_number: TelephoneNumber.parse(params[:to]).international_number.gsub(/\s+/, '')
    )
  end

  def inbox
    @inbox ||= tata_inbox.inbox
  end

  def account
    @account ||= inbox.account
  end

  def phone_number
    tata_inbox.tata? ? params[:from] : params[:from].gsub('whatsapp:', '')
  end

  def formatted_phone_number
    TelephoneNumber.parse(params[:from]).international_number.gsub(/\s+/, '')
  end

  def set_contact
    contact_inbox = ::ContactBuilder.new(
      source_id: formatted_phone_number,
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
      contact_inbox_id: @contact_inbox.id,
      additional_attributes: additional_attributes
    }
  end

  def set_conversation
    @conversation = @contact_inbox.conversations.first
    return if @conversation

    @conversation = ::Conversation.create!(conversation_params)
  end

  def contact_attributes
    {
      name: formatted_phone_number,
      phone_number: formatted_phone_number,
      additional_attributes: additional_attributes
    }
  end

  def additional_attributes
    {}
  end

  def attach_files
    return if params[:MediaUrl0].blank?

    file_resource = LocalResource.new(params[:MediaUrl0], params[:MediaContentType0])

    attachment = @message.attachments.new(
      account_id: @message.account_id,
      file_type: file_type(params[:MediaContentType0])
    )

    attachment.file.attach(
      io: file_resource.file,
      filename: file_resource.tmp_filename,
      content_type: file_resource.encoding
    )

    @message.save!
  rescue *ExceptionList::URI_EXCEPTIONS => e
    Rails.logger.info "invalid url #{file_url} : #{e.message}"
  end
end
