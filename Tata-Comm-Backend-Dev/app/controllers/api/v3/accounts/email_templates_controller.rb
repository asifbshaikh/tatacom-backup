class Api::V3::Accounts::EmailTemplatesController < Api::V1::Accounts::BaseController
  before_action :set_template, only: %i[show update destroy]

  #List of email template by pagination
  def index
    if params[:page].present?
      @email_templates = Current.account.email_templates.order('updated_at DESC').page(page).per(per_page)
    else
      @email_templates = Current.account.email_templates.order('updated_at DESC')
    end
    total_count = Current.account.email_templates.count
    render json: { email_templates: @email_templates, total_count: total_count }, status: :ok
  end

  #Create new email template
  def create
    @email_template = Current.account.email_templates.new(email_template_params)
    if @email_template.save
      render json: @email_template, status: :ok, message: "Email template create successfully!"
    else
      render json: @email_template.errors.full_messages, status: :unprocessable_entity
    end
  end

  #Show details of email template
  def show
    @email_template.present?
    render json: { email_template: @email_template, status: :ok }
  rescue StandardError => e
    Rails.logger.error "#{e.message}"
    render_could_not_create_error(e.message)
  end

  #Update email template
  def update
    @email_template.update(email_template_params)
    render json: { email_template: @email_template, message: "Email Template updated successfully" }, status: :ok
  rescue StandardError => e
    Rails.logger.error "#{e.message}"
    render_could_not_create_error(e.message)
  end

  #Delete email template
  def destroy
    @email_template.destroy
    render json: { message: "Email Template deleted successfully" }, status: :ok
  rescue StandardError => e
    Rails.logger.error "#{e.message}"
    render_could_not_create_error(e.message)
  end

  #To fetch pre-defined email templates
  def get_predefined_templates
    @email_templates = EmailTemplate.where(account_id: 1) #We need to maintain account_id 1 as Digo Account for predefined templates
    render json: { email_templates: @email_templates, status: :ok }
  rescue StandardError => e
    Rails.logger.error "#{e.message}"
    render_could_not_create_error(e.message)
  end

  private

  def email_template_params
    params.permit(
      :name, :body, :template_type, :locale, :account_id, design: {}
    )
  end

  def set_template
    @email_template = Current.account.email_templates.find(params[:id])
    render json: { errors: "Resource could not be found" }, status: :not_found and return unless @email_template.present?
  end
end
