require 'rest-client'
require 'json'
require 'active_support/time'

class Integrations::Rasa::ProcessorService
  pattr_initialize [:event_name!, :hook!, :event_data!]

  def perform
    message = event_data[:message]
    Rails.logger.info "@ @ @PERFORM@ @ @ **********RASA!!**********#{event_data}\n"
    return if message.private?
    return unless processable_message?(message)
    return unless message.conversation.pending?
    content = message_content(message)
    session_id = message.sender_id
    inbox_id = message.inbox_id
    account_id = message.account_id
    conversation_id = message.conversation_id
    #Rails.logger.info "@ @ @PERFORM@ @ @ USER_ID: #{session_id} \n INBOX_ID: #{inbox_id} \n ACCOUNT_ID: #{account_id}"
    responses = get_rasa_response(session_id, content, inbox_id, account_id, conversation_id) if content.present?
    process_response(message, responses, inbox_id, account_id, conversation_id)
  end

  private

  def message_content(message)
    # TODO: might needs to change this to a way that we fetch the updated value from event data instead
    # cause the message.updated event could be that that the message was deleted
    
    return message.content_attributes['submitted_values']&.first&.dig('value') if event_name == 'message.updated'
    

    content = nil
    if !message.attachments.blank? #&& message.attachments.first.file_url
      Rails.logger.info "###ATTACHMENT_EXIST### **********RASA!!********IF_CONDITION"
      content = {"content":message.content, "url":message.attachments.first.file_url, "file_type":message.attachments.first.file_type}
      content = content.stringify_keys
      content = content.to_s
    end

    if content
      Rails.logger.info "###ATTACHMENT_EXIST### **********RASA!!********#{content}"
      return content
    else
      Rails.logger.info "###ATTACHMENT_NOT_EXIST### **********RASA!!********#{message.content}"
      return message.content
    end
    
  end

  # def get_sender_id(message)
  #   message.sender_id
  # end

  def processable_message?(message)
    # TODO: change from reportable and create a dedicated method for this?
    #Rails.logger.info "### processable_message **********RASA!!********* #{message} ***#{message.conversation}****"
    #Rails.logger.info "### processable_message **********RASA!!********* REPORTABLE ***#{message.reportable}****"
    return unless message.reportable?
    return if message.outgoing? && !processable_outgoing_message?(message)

    true
  end

  def processable_message_v?(message)
    # TODO: change from reportable and create a dedicated method for this?
    #Rails.logger.info "### processable_message **********RASA!!********* #{message} ***#{message.conversation}****"
    #Rails.logger.info "### processable_message **********RASA!!********* REPORTABLE ***#{message.reportable}****"
    return unless message.reportable?
    return if message.outgoing? && !processable_outgoing_message?(message)

    true
  end

  def processable_outgoing_message?(message)
    #Rails.logger.info "### processable_outgoing_message **********RASA!!********* #{['input_select'].include?(message.content_type)} *******"
    event_name == 'message.updated' && ['input_select'].include?(message.content_type)
  end


  def get_rasa_response(session_id, message, inbox_id, account_id, conversation_id)
    #Rails.logger.info "### HOOK *******RASA!!***** #{hook.settings['credentials']}\n"

    url = nil

    webhook = hook.settings['credentials']['webhook']
    
    if webhook
      url = webhook
      #Rails.logger.info "### get_rasa_response ***URL_FOUND*******RASA!!********* #{url} ****"
    else
      url = nil
      Rails.logger.info "### get_rasa_response ***NO_URL_FOUND*******RASA!!********* #{url} ****"
    end
    inbox_data = Inbox.where(id: inbox_id)
    headers = {'Content-Type': 'application/json', 'Authorization': hook.settings['credentials']['token']}

    sender_data = Contact.where(id: session_id)
    sender_name = sender_data[0]['name']
    phone_number = sender_data[0]['phone_number']
    metadata = {"channel":inbox_data[0]['channel_type'], "inbox": inbox_data[0].name, "sender_name":sender_name, 'phone_number':phone_number}
    sender_id = nil
    if phone_number
      sender_id = phone_number
    else
      sender_id = conversation_id
    end
    payload = {"sender": sender_id,"message": message,"metadata": metadata}
    
    Rails.logger.info "&&&&&&&&&&&&&&&&&&&&&&&&\n"
    Rails.logger.info "### get_rasa_response **********RASA!!********* #{url} ******* #{payload}"
    responses = RestClient.post(url, payload.to_json, headers)
    responses =  JSON.parse(responses)
    #responses = [{"text": "@@HI@@"}]
    
    Rails.logger.info "### OUTPUT_RASA ******RASA!!***\n******RASA_RESPONSE*****#{responses}\n"
    Rails.logger.info "0000000000000000000000000000000000000000000000000000000000"
    
    responses
    end
  
  ##################################################################
  def process_response(message, responses, inbox_id, account_id, conversation_id)
    
    bot_wants_handoff = check_handoff_exist(responses)
    conversation_data = Conversation.where(id: conversation_id)
    # agent_assigned = conversation_data[0]['assignee_id']
    # agent_name = nil
    # if agent_assigned
    #   agent_data = User.where(id: agent_assigned)
    #   agent_name = agent_data[0]['name']
    # end
    # #current_agent = Current.account.users.find(current_user.id)
    # Rails.logger.info "%%%%%%CURRENT_AGENT%%%%%%#{agent_assigned}%%%%#{agent_name}%%%%%%%%%%%%%%%%%%%%%%%%%%"

    if bot_wants_handoff
      # TO DO 
      inbox_data = Inbox.where(id: inbox_id)
      greeting_message = inbox_data[0].greeting_message
      greeting_enabled = inbox_data[0].greeting_enabled
      #greeting_message = update_greeting_message(greeting_message, agent_name)
      out_of_office_message = inbox_data[0].out_of_office_message
      
      working_hours_enabled = check_working_hour_enabled(inbox_data)
      in_hour = in_business_hours(inbox_id, inbox_data)
      agent_available = check_agent_available(account_id)

      if !working_hours_enabled
        Rails.logger.info "WORKING HOURS NOT ENABLED\n"
        if greeting_enabled && greeting_message
          responses << {"custom" => {"content" => greeting_message}}
        end
        basic_process_response(message, responses, inbox_id, account_id)
      else
        Rails.logger.info "WORKING HOURS ENABLED\n"
        if in_hour && agent_available
          if greeting_enabled && greeting_message
            responses << {"custom" => {"content" => greeting_message}}
          end
          basic_process_response(message, responses, inbox_id, account_id)
        else
          create_conversation(message, {"content" => out_of_office_message})
          # FOR TESTING EMAIL ONLY
          #process_action(message, "handoff")
          #process_action(message, "pending")

        end
      end
    else
      basic_process_response(message, responses, inbox_id, account_id)
    end


  end
  ###################################################################

  def basic_process_response_old(message, responses, inbox_id, account_id)
    responses.each do |response|
      content_params = generate_content_params(response)
      if content_params['action']
        process_action(message, content_params['action'])
      else
        create_conversation(message, content_params)
      end
    end
  end

  def basic_process_response(message, responses, inbox_id, account_id)
    responses.each do |response|
      content_params = generate_content_params(response)
      handoff_action = nil
      if content_params['action']
        if content_params['content'] || content_params['body'] || content_params['type']
          handoff_action = content_params['action']
          content_params.delete('action')
          create_conversation(message, content_params)
        end
        if handoff_action
          process_action(message, handoff_action)
        else
          process_action(message, content_params['action'])
        end
        
      else
        create_conversation(message, content_params)
      end
    end
  end


  # def basic_process_response(message, responses, inbox_id, account_id)
  #   responses.each do |response|
  #     content_params = generate_content_params(response)
  #     handoff_action = nil
  #     if content_params['action']
  #       if content_params['action'] != "handoff"
  #         handoff_action = content_params['action']
  #         #content_params.delete('action')
  #         create_conversation(message, content_params)
  #       end
  #       if handoff_action == "handoff"
  #         process_action(message, handoff_action)
  #       # else
  #       #   process_action(message, content_params['action'])
  #       end
        
  #     else
  #       create_conversation(message, content_params)
  #     end
  #   end
  # end

  def process_action_only(message, responses, inbox_id, account_id)
    responses.each do |response|
      content_params = generate_content_params(response)
      if content_params['action']
        process_action(message, content_params['action'])
      # else
      #   create_conversation(message, content_params)
      end
    end
  end


  ######################################################################
  def process_response_old(message, responses, inbox_id, account_id)
    Rails.logger.info "### process_response *****NEW*****RASA!!********* #{message} ******* #{responses}"
    
    responses.each do |response|
      content_params = generate_content_params(response)

      if content_params['action']
        # TODO
        # Get Inbox data based on inbox Id
        # Need to run a query that will give all data about the inbox based in inbox id
        inbox_data = Inbox.where(id: inbox_id)
        greeting_message = inbox_data[0].greeting_message
        greeting_enabled = inbox_data[0].greeting_enabled

        out_of_office_message = inbox_data[0].out_of_office_message
        working_hours_enabled = check_working_hour_enabled(inbox_data)
        in_hour = in_business_hours(inbox_id, inbox_data)
        
        agent_available = check_agent_available(account_id)

        if !working_hours_enabled
          Rails.logger.info "WORKING HOURS NOT ENABLED\n"
          process_action(message, content_params['action'])
        else
          Rails.logger.info "WORKING HOURS ENABLED\n"
          if in_hour && agent_available
            process_action(message, content_params['action'])
          else
            create_conversation(message, {"content" => out_of_office_message})
          end
          
        end
      else
        create_conversation(message, content_params)
      end
    end
  end

  def generate_content_params(response)
    
    Rails.logger.info "### generate_content_params **********RASA!!********* #{response} *******"
    content_params = {}
    return response['custom']
  end
  #   if response['buttons']
  #     content_params['type'] = "button"
  #     button_data = []
    
  #     response['buttons'].each_with_index do |button, i|
  #       meta = { "type" => "reply" }
  #       meta["reply"] = { "title" => button['title'], "id" => i + 1 }
  #       button_data << meta
  #       meta = nil
  #     end
  #     content_params["body"] = {}
  #     content_params["body"]["text"] = response['text']  if response['text']
  #     content_params["buttons"] = button_data
  #   else
  #     content_params["content"] = response['text']  if response['text']
  #   end 
  #   if response['custom']
  #       content_params["action"] = response['custom']['action'] if response['custom']['action']
  #   end
  #   Rails.logger.info "### generate_content_params *****CONTENT_PARAMS*****RASA!!********* #{content_params} *******"
  #   content_params
  # end

  def generate_content_params_old(response)
    
    Rails.logger.info "### generate_content_params **********RASA!!********* #{response} *******"
    content_params = {}
    if response['buttons']
      content_params['type'] = "button"
      button_data = []
    
      response['buttons'].each_with_index do |button, i|
        meta = { "type" => "reply" }
        meta["reply"] = { "title" => button['title'], "id" => i + 1 }
        button_data << meta
        meta = nil
      end
      content_params["body"] = {}
      content_params["body"]["text"] = response['text']  if response['text']
      content_params["buttons"] = button_data
    else
      content_params["content"] = response['text']  if response['text']
    end 
    if response['custom']
        content_params["action"] = response['custom']['action'] if response['custom']['action']
    end
    Rails.logger.info "### generate_content_params *****CONTENT_PARAMS*****RASA!!********* #{content_params} *******"
    content_params
  end

  def create_conversation(message, content_params)
    Rails.logger.info "@@@@@@@@@@@@@@@@@@ @@@@@RASA@@@@@@ @@@@@@@@@@ @@@@@@@ @@@@ @@@@@*"
    Rails.logger.info "### create_conversation **********RASA!!********* #{message} ******* #{content_params}"
    return if !content_params

    conversation = message.conversation
    #Rails.logger.info "### create_conversation **********RASA!!*************** #{conversation}"
    
    #if content_params['type'].present?
    if content_params['type']
      case content_params['type']
        when 'button'
          #Rails.logger.info "###BUTTONS **********RASA!!*************** #{content_params}"
            conversation.messages.create(
            message_type: :outgoing,
            account_id: conversation.account_id,
            inbox_id: conversation.inbox_id,
            content_type: 'button',
            content: content_params
            )

        when 'document'
         
            conversation.messages.create(
            message_type: :outgoing,
            account_id: conversation.account_id,
            inbox_id: conversation.inbox_id,
            content_type: 'text_document',
            content: content_params
            )

        when 'menu'
            #Rails.logger.info "### create_conversation ***#MENU*******RASA!!********* #{message} ******* #{content_params}"
            conversation.messages.create(
            message_type: :outgoing,
            account_id: conversation.account_id,
            inbox_id: conversation.inbox_id,
            content_type: 'text_menu',
            content: content_params
            )

        when 'audio'
            #Rails.logger.info "### create_conversation ***#AUDIO*******RASA!!********* #{message} ******* #{content_params}"
            conversation.messages.create(
            message_type: :outgoing,
            account_id: conversation.account_id,
            inbox_id: conversation.inbox_id,
            content_type: 'audio',
            content: content_params
            )

        when 'image_menu'
         
            conversation.messages.create(
            message_type: :outgoing,
            account_id: conversation.account_id,
            inbox_id: conversation.inbox_id,
            content_type: 'image_menu',
            content: content_params
            )    
        when 'image_button'
         
            conversation.messages.create(
            message_type: :outgoing,
            account_id: conversation.account_id,
            inbox_id: conversation.inbox_id,
            content_type: 'image_button',
            content: content_params
            )   
        when 'image'

          conversation.messages.create(
            message_type: :outgoing,
            account_id: conversation.account_id,
            inbox_id: conversation.inbox_id,
            content_type: 'image',
            content: content_params
            )    

        when 'video'
          
          conversation.messages.create(
            message_type: :outgoing,
            account_id: conversation.account_id,
            inbox_id: conversation.inbox_id,
            content_type: 'video',
            content: content_params
            ) 
        
        when 'location'

          conversation.messages.create(
              message_type: :outgoing,
              account_id: conversation.account_id,
              inbox_id: conversation.inbox_id,
              content_type: 'location',
              content: content_params
              )

        when 'contacts'
          #Rails.logger.info "### create_conversation ***#CONTACT*******RASA!!********* #{message} ******* #{content_params}"
          conversation.messages.create(
              message_type: :outgoing,
              account_id: conversation.account_id,
              inbox_id: conversation.inbox_id,
              content_type: 'contacts',
              content: content_params
              )
              
        when 'product'
          #Rails.logger.info "### create_conversation ***#PRODUCT*******RASA!!********* #{message} ******* #{content_params}"
          conversation.messages.create(
                  message_type: :outgoing,
                  account_id: conversation.account_id,
                  inbox_id: conversation.inbox_id,
                  content_type: 'product',
                  content: content_params
                  )

        when 'sticker'
          #Rails.logger.info "### create_conversation ***#STICKER*******RASA!!********* #{message} ******* #{content_params}"
          conversation.messages.create(
                          message_type: :outgoing,
                          account_id: conversation.account_id,
                          inbox_id: conversation.inbox_id,
                          content_type: 'sticker',
                          content: content_params
                          )
        when 'product_list'
          #Rails.logger.info "### create_conversation ***#PRODUCT_LIST*******RASA!!********* #{message} ******* #{content_params}"
          conversation.messages.create(
                          message_type: :outgoing,
                          account_id: conversation.account_id,
                          inbox_id: conversation.inbox_id,
                          content_type: 'product_list',
                          content: content_params
                          ) 
        
        end

    else       
      Rails.logger.info "###TYPE=ELSE **********RASA!!*************** #{content_params}"
        conversation.messages.create(content_params.merge({
                                                        message_type: :outgoing,
                                                        account_id: conversation.account_id,
                                                        inbox_id: conversation.inbox_id 
                                                        }))
    end

  end

  def process_action(message, action)
    case action
    when 'handoff'
      Rails.logger.info "### HANDOOF **********RASA HANDOFF!!********* #{message} ******* #{action}"
      message.conversation.open!
      message.conversation.conversation_open_by_bot_callbacks
    when 'resolve'
      Rails.logger.info "### RESOLVE **********RASA HANDOFF!!********* #{message} ******* #{action}"
      message.conversation.resolved!
    # when 'pending'
    #   Rails.logger.info "### RESOLVE **********RASA HANDOFF!!********* #{message} ******* #{action}"
    #   message.conversation.pending!
    end
  end

  def check_working_hour_enabled(inbox_data)
    return inbox_data[0].working_hours_enabled
  end

  def in_business_hours(inbox_id, inbox_data)
    time_zone = inbox_data[0]['timezone']
    #Rails.logger.info "CURRENT TIME ZONE :: #{time_zone}\n"
    working_hours_data = WorkingHour.where(inbox_id: inbox_id)
    timezone = ActiveSupport::TimeZone.new(time_zone)
    current_time = Time.now.in_time_zone(timezone)
    day_of_week = current_time.wday
    #Rails.logger.info "CURRENT TIME :: #{current_time}\n"
    #Rails.logger.info "CURRENT DAY OF WEEK :: #{day_of_week}\n"
    working_hours = nil
    working_hours_data.each do |hour_data|
      #Rails.logger.info "MMMM MMMM MMMM MMMMM"
      #Rails.logger.info hour_data
      if hour_data.day_of_week == day_of_week
        #Rails.logger.info "--------------------"
        working_hours = hour_data
        #Rails.logger.info "--------------------"
      end
    end

      if working_hours.closed_all_day
        #Rails.logger.info "Closed All Day\n"
        return false
      elsif working_hours[:open_all_day]
        #Rails.logger.info "Open all hours for the day\n"
        return true
      else
        open_time = Time.new(current_time.year, current_time.month, current_time.day, working_hours.open_hour, working_hours.open_minutes, 0, timezone)
        close_time = Time.new(current_time.year, current_time.month, current_time.day, working_hours.close_hour, working_hours.close_minutes, 0, timezone)
        # puts "OPEN TIME :: #{open_time}"
        # puts "CLOSE TIME :: #{close_time}"
        # puts "CURRENT TIME :: #{current_time}"
        if current_time.between?(open_time, close_time)
          #Rails.logger.info "Good time"
          return true
        else
          #Rails.logger.info "NOT IN BUSINESS HOURS"
          return current_time.between?(open_time, close_time)
        end
      end


    return true
  end

  def check_agent_available(account_id)
    avaiable = false
    agent_data = AccountUser.where(account_id: account_id)

    agent_data.each do |agent|
      if agent.availability == "online"
        avaiable = true
      end
    end
    return avaiable
  end

  def update_greeting_message(greeting_message, agent_name)
    new_message = greeting_message
    if greeting_message && agent_name
      if greeting_message['{{agentName}}']
        new_message = greeting_message.gsub("{{agentName}}", agent_name)
      end
    end
    return new_message
  end

  def check_handoff_exist(responses)
    handoff = false
  
    responses.each do |response|
      if response['custom']
        if response['custom']['action']
          if response['custom']['action'] == "handoff"
            handoff = true
          end
        end
      end
    end
    return handoff
  end
  

# LAST LINE
end

  

