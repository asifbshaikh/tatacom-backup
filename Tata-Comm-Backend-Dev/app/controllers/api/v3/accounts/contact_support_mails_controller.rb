class Api::V3::Accounts::ContactSupportMailsController < Api::V1::Accounts::BaseController

  before_action :check_authorization

  def new
    @contact_support_mail = current_user.contact_support_mails.new
  end

  def create
    @contact_support_mail = current_user.contact_support_mails.new(contact_support_mail_params)
    if @contact_support_mail.save
      ContactSupportMailJob.perform_now( {contact_support_mail: @contact_support_mail, user_mail: ENV["CONTACT_SUPPORT_MAIL"]} )
      render json: { message: I18n.t('contact_support_mail.success.email_message') }, status: :ok
    else
      render json: {errors: @contact_support_mail.errors.full_messages}, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_could_not_create_error(e.message)
  end

  private

  def contact_support_mail_params
    params.require(:contact_support_mail).permit(:subject, :description, :product_area, :attachment_file, :priority, cc_users: [], bcc_users: [])
  end
end
