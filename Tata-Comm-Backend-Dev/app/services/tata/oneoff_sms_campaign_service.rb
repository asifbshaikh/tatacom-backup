class Tata::OneoffSmsCampaignService
  pattr_initialize [:campaign!]

  def perform
    raise "Invalid campaign #{campaign.id}" if (campaign.inbox.inbox_type != 'Tata SMS' && campaign.inbox.inbox_type != 'sms') || !campaign.one_off?
    raise 'Completed Campaign' if campaign.completed?

    # marks campaign completed so that other jobs won't pick it up
    campaign.completed!

    audience_label_ids = campaign.audience.select { |audience| audience['type'] == 'Label' }.pluck('id')
    audience_labels = campaign.account.labels.where(id: audience_label_ids).pluck(:title)
    campaign.audience.each do |audienceLabel|
      if (audienceLabel['type'] == 'Label') && !audienceLabel['id'] && audienceLabel['title']
        # if id is not present and auto-generated title has been passed
        audience_labels << audienceLabel['title']
      end
    end
    process_audience(audience_labels)
  end

  private

  delegate :inbox, to: :campaign
  delegate :channel, to: :inbox

  def process_audience(audience_labels)
    campaign.account.contacts.tagged_with(audience_labels, any: true).each do |contact|
      next if contact.phone_number.blank?
      # Rails.logger.info "process_audienceprocess_audienceprocess_audienceprocess_audienceprocess_audience"
      # Rails.logger.info contact
      # Rails.logger.info channel
      # Rails.logger.info campaign

      @waba_id = send_message(to: contact.phone_number, from: channel.phone_number, content: campaign.message, campaign: campaign)

      channel = campaign.inbox
      @inbox = channel
      @contact = contact

      # Rails.logger.info campaign
      # Rails.logger.info @inbox
      # Rails.logger.info @contact

      set_contact

      set_conversation

      message_status = save_message(campaign: campaign)
      # Rails.logger.info message_status
    end
  end

  def getURI
    # 'https://sms.tatacommunications.com/mmx/v1/messaging/sms'
    "https://engage-api.digo.link/v1/messaging/sms"
  end

  def getData(to:, from:, content:, campaign:)
    # Rails.logger.info "getDatagetDatagetDatagetDatagetDatagetDatagetDatagetData"
    # Rails.logger.info to
    # Rails.logger.info from
    # Rails.logger.info content
    # Rails.logger.info campaign
    # Rails.logger.info channel
    @toSend = {
      'to' => to,
      'from' => from,
      'msg' => content,
      'type' => "transactional",
      'tiny' => 1,
      'dlr' => {
        'mask' => 1,
        'url' => campaign.inbox.callback_webhook_url
      }
    }

    @toSend.to_json
  end

  def send_message(to:, from:, content:, campaign:)
    # Rails.logger.info "send_messagesend_messagesend_messagesend_messagesend_message"
    # Rails.logger.info to
    # Rails.logger.info from
    # Rails.logger.info content
    uri = URI.parse(getURI)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    # req = Net::HTTP::Post.new(uri.path, initheader = { 'Content-Type' => 'application/json' })
    req = Net::HTTP::Post.new(uri.path, initheader = {
      'Content-Type' => 'application/json',
      'Authorization' => "Bearer #{channel.token}",
      'X-Authorization' => "Basic #{Base64.strict_encode64(channel.app_id + ":" + channel.ss_key)}"
    })
    req.body = getData(to: to, from: from, content: content, campaign: campaign)
    # req.basic_auth channel.appID, channel.ssKey
    res = https.request(req)
    # Rails.logger.info "send_messagesend_messagesend_messagesend_messagesend_message=>res"
    # Rails.logger.info res
    # Rails.logger.info res.body
    # message.update!(source_id: JSON.parse(res.body)["id"])
    source_id = JSON.parse(res.body)["id"]
    source_id
  end

  def set_contact
    phoneNumberWithoutPlus = @contact.phone_number.sub("+", "")
    contact_inbox = ::ContactBuilder.new(
      source_id: phoneNumberWithoutPlus,
      inbox: @inbox,
      contact_attributes: { name: @contact.name, phone_number: @contact.phone_number }
    ).perform

    @contact_inbox = contact_inbox
    @contact = contact_inbox.contact

    # Rails.logger.info "@contact_inboxcontact_inboxcontact_inboxcontact_inboxcontact_inbox"
    # Rails.logger.info @contact_inbox
    # Rails.logger.info @contact
  end

  def conversation_params
    paramConversation = {
      account_id: @inbox.account_id,
      inbox_id: @inbox.id,
      contact_id: @contact.id,
      contact_inbox_id: @contact_inbox.id
    }
    paramConversation
  end

  def set_conversation
    @conversation = @contact_inbox.conversations.last
    # Rails.logger.info "@conversationconversationconversationconversationconversationconversation"
    # Rails.logger.info @conversation
    return if @conversation

    @conversation = ::Conversation.create!(conversation_params)
  end

  def save_message(campaign:)
    @message = @conversation.messages.build(
      content: campaign.message,
      # content_type: template_info_obj['preview_content_type'],
      account_id: @inbox.account_id,
      inbox_id: @inbox.id,
      message_type: :outgoing,
      sender: @contact,
      source_id: @waba_id,
      campaign_id: campaign.display_id
    )

    isSaved = @message.save!
    # Rails.logger.info campaign
    # Rails.logger.info @message
    # Rails.logger.info isSaved
    return true
  end
end
