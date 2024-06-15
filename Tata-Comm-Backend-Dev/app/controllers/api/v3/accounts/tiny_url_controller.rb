class Api::V3::Accounts::TinyUrlController < Api::V1::Accounts::BaseController
  def generate
    tiny_url_api = TinyUrlApi.new.generate_tiny_url(params[:url], params[:keyword])
    render json: tiny_url_api
  end

  def tiny_url_tracking_report
    tracking_report = TinyUrlApi.new.shorturl_tracking_report(params[:shorturl])
    render json: tracking_report
  end
end
