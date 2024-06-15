class Api::V3::Accounts::CsatSurveyResponsesController < Api::V1::Accounts::CsatSurveyResponsesController
  include Pagination

  RESULTS_PER_PAGE = 10

  def index; end

  def set_current_page_surveys
    @csat_survey_responses = @csat_survey_responses.page(@current_page).per(@per_page)
    @pagination_values = pagination_values(@csat_survey_responses)
  end

  def set_current_page
    @current_page = params[:page] || 1
    @per_page = params[:per_page] || RESULTS_PER_PAGE
  end
end