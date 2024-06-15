class Api::V1::Accounts::TemplatesController < Api::V1::Accounts::BaseController
  before_action :check_authorization

  def index
    render json: { success: true, data: api_whatsapp_template }
  end

  private

  def check_authorization
    super(User)
  end

  def api_whatsapp_template
    inbox = Current.account.inboxes.find(params[:inbox_id]);
    channel = inbox.channel
    channel.get_template_list_meta()
  end
end
