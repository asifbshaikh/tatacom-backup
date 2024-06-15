class Tata::CallbackController < ApplicationController
  def create
    ::Tata::IncomingMessageService.new(params: permitted_params, basic_auth: request.headers[:Authorization]).perform

    head :no_content
  end

  private

  def permitted_params
    params.permit(
      :ApiVersion,
      :SmsSid,
      :From,
      :ToState,
      :ToZip,
      :AccountSid,
      :MessageSid,
      :FromCountry,
      :ToCity,
      :FromCity,
      :To,
      :FromZip,
      :Body,
      :ToCountry,
      :FromState,
      :MediaUrl0,
      :Authorization,
      :msg,
      :to,
      :from,
      :MediaContentType0,
      :id,
      :status,
    )
  end
end
