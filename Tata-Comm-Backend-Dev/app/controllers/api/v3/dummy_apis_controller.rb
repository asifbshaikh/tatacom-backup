class Api::V3::DummyApisController < ApplicationController
  before_action :check_token
  def email
    id = Time.now.strftime("%Y%m%d%H.%9N")
    render json: { "messageId": "<#{id}@smtp-relay.mailin.fr>", status: :ok }
  end

  def whatsapp
    render json: {"id":"wamid." + SecureRandom.hex, status: :ok }
  end

private

  def check_token
    dummy_token = ENV.fetch('DUMMY_API_TOKEN', nil)
    token  = request.headers['Authorization']
    render status: :unauthorized if dummy_token != token
  end
end
