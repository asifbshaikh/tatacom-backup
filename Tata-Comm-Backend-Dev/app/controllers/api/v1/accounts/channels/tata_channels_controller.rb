class Api::V1::Accounts::Channels::TataChannelsController < Api::V1::Accounts::BaseController
  before_action :authorize_request

  def create
    ActiveRecord::Base.transaction do
      code = authenticate_tata
      build_inbox if code == '400'
    rescue StandardError => e
      Sentry.capture_exception(e)
      render_could_not_create_error(e.message)
    end
  end

  private

  def authorize_request
    authorize ::Inbox
  end

  def getURI
    # 'https://sms.tatacommunications.com:3853/v1/messaging/sms'
    "https://engage-api.digo.link/v1/messaging/sms"
  end

  def phone_number
    permitted_params[:phone_number]
  end

  def getData
    @toSend = {
      'to' => 'checkauth',
      'from' => phone_number,
      'msg' => 'checkauth',
      'tlv' => {
        'PE_ID' => '0',
        'TEMPLATE_ID' => '0',
        'TELEMARKETER_ID' => '0'
      }
    }

    @toSend.to_json
  end

  def authenticate_tata
    uri = URI.parse(getURI)

    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    # req = Net::HTTP::Post.new(uri.path, initheader = { 'Content-Type' => 'application/json' })
    req = Net::HTTP::Post.new(uri.path, initheader = {
      'Content-Type' => 'application/json',
      'Authorization' => "Bearer #{permitted_params[:token]}",
      'X-Authorization' => "Basic #{Base64.strict_encode64(permitted_params[:app_id] + ":" + permitted_params[:ss_key])}"
    })

    req.body = getData
    # req.basic_auth permitted_params[:app_id], permitted_params[:ss_key]

    res = https.request(req)

    res.code
  end

  def setup_webhooks
    # ::Twilio::WebhookSetupService.new(inbox: @inbox).perform
  end

  def medium
    permitted_params[:medium]
  end

  def build_inbox
    @tata_channel = Current.account.tata.create!(
      app_id: permitted_params[:app_id],
      ss_key: permitted_params[:ss_key],
      token: permitted_params[:token],
      phone_number: phone_number,
      medium: medium
    )

    Rails.logger.info @tata_channel
    @inbox = Current.account.inboxes.create(
      name: permitted_params[:name],
      channel: @tata_channel
    )

    Rails.logger.info @inbox
  end

  def permitted_params
    params.require(:tata_channel).permit(
      :account_id, :phone_number, :app_id, :ss_key, :token, :name, :medium
    )
  end
end
