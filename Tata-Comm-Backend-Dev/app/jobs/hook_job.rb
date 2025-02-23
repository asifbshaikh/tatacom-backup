class HookJob < ApplicationJob
  queue_as :integrations

  def perform(hook, event_name, event_data = {})
    case hook.app_id
    when 'slack'
      process_slack_integration(hook, event_name, event_data)
    when 'rasa'
      process_rasa_integration(hook, event_name, event_data)
    when 'botpress'
      process_botpress_integration(hook, event_name, event_data)
    when 'dialogflow'
      process_dialogflow_integration(hook, event_name, event_data)
    end
  rescue StandardError => e
    Sentry.capture_exception(e)
  end

  private

  def process_slack_integration(hook, event_name, event_data)
    return unless ['message.created'].include?(event_name)

    message = event_data[:message]
    Integrations::Slack::SendOnSlackService.new(message: message, hook: hook).perform
  end

  def process_rasa_integration(hook, event_name, event_data)
    return unless ['message.created', 'message.updated'].include?(event_name)
    Integrations::Rasa::ProcessorService.new(event_name: event_name, hook: hook, event_data: event_data).perform
    # return unless ['message.created'].include?(event_name)

    # message = event_data[:message]
    #Integrations::Rasa::SendOnRasaService.new(message: message, hook: hook).perform
  end

  def process_botpress_integration(hook, event_name, event_data)
    return unless ['message.created'].include?(event_name)

    message = event_data[:message]
    #Integrations::Botpress::SendOnBotpressService.new(message: message, hook: hook).perform
  end

  def process_dialogflow_integration(hook, event_name, event_data)
    return unless ['message.created', 'message.updated'].include?(event_name)

    Integrations::Dialogflow::ProcessorService.new(event_name: event_name, hook: hook, event_data: event_data).perform
  end
end
