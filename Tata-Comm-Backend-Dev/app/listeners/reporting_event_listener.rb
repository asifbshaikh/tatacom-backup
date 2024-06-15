class ReportingEventListener < BaseListener
  def conversation_resolved(event)
    conversation = extract_conversation_and_account(event)[0]
    # time_to_resolve = conversation.updated_at.to_i - conversation.created_at.to_i
    selfOpenEvents = conversation.account.reporting_events.where(conversation_id: conversation.id, name: 'conversation_opened')
    if selfOpenEvents.empty?
      # where bot is not applied, calculate from the conversation start time
      time_to_resolve = conversation.updated_at.to_i - conversation.created_at.to_i
    else
      # where bot is applied, calculate from the bot assign time
      selfOpenEvent = selfOpenEvents.last
      time_to_resolve = conversation.updated_at.to_i - selfOpenEvent.created_at.to_i
    end

    reporting_event = ReportingEvent.new(
      name: 'conversation_resolved',
      value: time_to_resolve,
      account_id: conversation.account_id,
      inbox_id: conversation.inbox_id,
      user_id: conversation.assignee_id,
      conversation_id: conversation.id
    )
    reporting_event.save
  end

  def conversation_opened(event)
    conversation = extract_conversation_and_account(event)[0]
    time_to_resolve = conversation.updated_at.to_i - conversation.created_at.to_i

    reporting_event = ReportingEvent.new(
      name: 'conversation_opened',
      value: time_to_resolve,
      account_id: conversation.account_id,
      inbox_id: conversation.inbox_id,
      user_id: conversation.assignee_id,
      conversation_id: conversation.id
    )
    reporting_event.save
  end

  def first_reply_created(event)
    message = extract_message_and_account(event)[0]
    conversation = message.conversation
    first_response_time = message.created_at.to_i - conversation.created_at.to_i

    reporting_event = ReportingEvent.new(
      name: 'first_response',
      value: first_response_time,
      account_id: conversation.account_id,
      inbox_id: conversation.inbox_id,
      user_id: conversation.assignee_id,
      conversation_id: conversation.id
    )
    reporting_event.save
  end
end
