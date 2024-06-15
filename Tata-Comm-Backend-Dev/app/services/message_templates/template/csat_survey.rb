class MessageTemplates::Template::CsatSurvey
  pattr_initialize [:conversation!]

  def perform
    ActiveRecord::Base.transaction do
      conversation.messages.create!(csat_survey_message_params)
    end
  end

  private

  delegate :contact, :account, to: :conversation
  delegate :inbox, to: :message

  def csat_survey_message_params
    {
      account_id: @conversation.account_id,
      inbox_id: @conversation.inbox_id,
      message_type: :template,
      content_type: :input_csat,
      content: generate_survey_url
    }
  end

  def generate_survey_url
    url_api = TinyUrlApi.new
    short_url = url_api.generate_tiny_url("#{ENV['FRONTEND_URL']}/survey/responses/#{@conversation.uuid}", nil)
    I18n.t('conversations.survey.response', link:  short_url["shorturl"])
  end
end
