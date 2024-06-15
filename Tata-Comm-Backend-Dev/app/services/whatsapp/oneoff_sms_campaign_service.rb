class Whatsapp::OneoffSmsCampaignService
  pattr_initialize [:campaign!]

  def perform
    raise "Invalid campaign #{campaign.id}" if campaign.inbox.inbox_type != 'Whatsapp' || !campaign.one_off?
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

    # Rails.logger.info campaign
    # custom attributes are updated
    campaignMessageJson = JSON.parse(campaign.description)
    Rails.logger.info campaignMessageJson
    # Rails.logger.info campaignMessageJson['variablesInfo']
    # templateInfo = channel.get_template_info_by_name(campaign.title)
    Rails.logger.info "templateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfotemplateInfo"
    templateInfo = campaignMessageJson

    campaign.account.contacts.tagged_with(audience_labels, any: true).each do |contact|
      next if contact.phone_number.blank?

      send_message(to: contact.phone_number, campaign: campaign, templateInfo: templateInfo, contact: contact)
    end
  end

  def send_message(to:, campaign:, templateInfo:, contact:)
    template_info_obj = create_template_info(campaign: campaign, templateInfo: templateInfo, contact: contact)
    @waba_id = channel.send_template_message_meta(to, template_info_obj)
    
    channel = campaign.inbox
    @inbox = channel
    @contact = contact

    # Rails.logger.info campaign
    # Rails.logger.info @inbox
    # Rails.logger.info @contact

    set_contact

    set_conversation

    message_status = save_message(campaign: campaign, template_info_obj: template_info_obj)
    # Rails.logger.info message_status
  end
  
  private
  def save_message(campaign:, template_info_obj:)
    @message = @conversation.messages.build(
      content: template_info_obj['preview'],
      content_type: template_info_obj['preview_content_type'],
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

  def conversation_params
    paramConversation = {
      account_id: @inbox.account_id,
      inbox_id: @inbox.id,
      contact_id: @contact.id,
      contact_inbox_id: @contact_inbox.id
    }
    paramConversation
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

  def set_conversation
    @conversation = @contact_inbox.conversations.last
    # Rails.logger.info "@conversationconversationconversationconversationconversationconversation"
    # Rails.logger.info @conversation
    return if @conversation

    @conversation = ::Conversation.create!(conversation_params)
  end

  def create_template_info(campaign:, templateInfo:, contact:)
     body = {};
     body["name"] = templateInfo['name'];
     body["lang_code"] = "en";
     body["preview_content_type"] = "text";
     
     components = []
     bodyParameters = [];
     headerParameters = [];
     buttonsParameters = [];
     buttonsParametersIndex = 0;

     locationObject = {}
     replacements = {}
     templateInfo['variablesInfo'].each do |templateParemeter|
      # Rails.logger.info "templateParemetertemplateParemetertemplateParemetertemplateParemeter"
      # Rails.logger.info templateParemeter
      # templateParemeterText = templateParemeter[:text]
      # templateParemeterType = templateParemeter[:type]
      
      templateParemeterText = templateParemeter['val']
      templateParemeterType = templateParemeter['valtype'] ? templateParemeter['valtype'] : 'text';

      if contact[templateParemeterText]
        componentsval = {'type': templateParemeterType, 'text': contact[templateParemeterText]}
      elsif contact.custom_attributes.dig(templateParemeterText)
        componentsval = {'type': templateParemeterType, 'text': contact.custom_attributes.dig(templateParemeterText)}
      else
        componentsval = {'type': templateParemeterType, 'text': ''}
      end
      
      if templateParemeter['type'] === "BODY"
        bodyParameters << componentsval
        replacements["{{#{templateParemeter['key']}}}"] = componentsval[:text]
      elsif templateParemeter['type'] === "HEADER"
        fileKey = templateParemeter['format'].downcase
        if fileKey === 'location'
          locationObject[templateParemeter['key']] = componentsval[:text]
        else
          componentsvalNew = {'type': fileKey}
          if templateParemeter['value']
            componentsvalNew[fileKey] = {'value': templateParemeter['value']}
          else
            componentsvalNew[fileKey] = {'link': componentsval[:text]}
            if fileKey === 'document'
              componentsvalNew[fileKey]['filename'] = 'File'
            end
          end
          headerParameters << componentsvalNew
        end
      elsif templateParemeter['type'] === "BUTTONS"
        buttonsParametersIndex = templateParemeter['key']
        buttonsParameters << componentsval
      end
 
     end

     Rails.logger.info locationObject
     if !locationObject.empty?
      headerParameters << {'type': 'location', 'location': locationObject}.stringify_keys
     end
     if !headerParameters.empty? && (headerParameters.first['type'] != 'text' && headerParameters.first[:type] != 'text')
        #for text type variable no need to send variable (static only)
        components << {'type': 'header', 'parameters': headerParameters}
     end
     components << {'type': 'body', 'parameters': bodyParameters} if !bodyParameters.empty?
     components << {'type': 'button', "sub_type": "url", "index": buttonsParametersIndex.to_s, 'parameters': buttonsParameters} if !buttonsParameters.empty?


    body["components"] = components.to_json #so that components value will not change after this
     findings = {}
     templateInfo['components'].each do |templateComponent|
      if templateComponent['type'] === "BODY"
        findings['BODY'] = 'Y'
      elsif templateComponent['type'] === "HEADER"
        findings['HEADER'] = 'Y'
        findings['HEADER_FORMAT'] = templateComponent['format']
      elsif templateComponent['type'] === "BUTTONS"
        findings['BUTTONS'] = 'Y'
        findings['BUTTONS_BUTTONS'] = templateComponent['buttons']
        body["preview_content_type"] = 'button' # by default make it button type
      elsif templateComponent['type'] === "FOOTER"
        findings['FOOTER'] = 'Y'
        if templateComponent['text']
          findings['FOOTER_TEXT'] = templateComponent['text']
        end
      end
     end

     body["preview"] = campaign.message.gsub(Regexp.union(replacements.keys), replacements)

     message = {"body": {"text": body["preview"]}} # by default text come in ['body']['text']

     if findings['HEADER'] === 'Y'
      # image, document, video, audio, text LOGIC START
      fileKey = findings['HEADER_FORMAT'].downcase
      message = headerParameters.first
      message[fileKey]['caption'] = body["preview"]

      if findings['HEADER_FORMAT'] === 'IMAGE'
        fileKey = 'image_button'
        message["type"] = 'image_button';
      end
      if findings['HEADER_FORMAT'] === 'DOCUMENT'
        fileKey = 'text_document'
      end
      if findings['HEADER_FORMAT'] === 'TEXT'
        fileKey = 'text_header'
      end

      body["preview_content_type"] = fileKey
     end
     

     if findings['BUTTONS_BUTTONS']
        buttons = []
        findings['BUTTONS_BUTTONS'].each do |button|
          buttons << {
            "type": button['type'] === 'QUICK_REPLY' ? "reply" : "reply",
            "reply": {
            "title": button['text'],
            # "id": 1
          }
        }
        end
        message['buttons'] = buttons
     end

     if findings['FOOTER_TEXT']
      message['footer_text'] = findings['FOOTER_TEXT']
     end

    #  if body["preview_content_type"] != 'text' || message["type"] # type text means no object
     if body["preview_content_type"] != 'text'
       body["preview"] = JSON.parse(message.to_json) # save as object for other than text message
     end

     Rails.logger.info "create_template_infocreate_template_info"
     Rails.logger.info body
     body
  end
end
