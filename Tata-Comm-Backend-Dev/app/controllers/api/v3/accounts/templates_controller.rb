class Api::V3::Accounts::TemplatesController < Api::V1::Accounts::BaseController
  before_action :find_template, only: [:update, :destroy, :show]

  # all sms template by pagination
  def index
    if params[:page].present?
      page = params[:page].to_i
      per_page = params[:per_page].to_i
      @templates = Current.account.templates.order('updated_at DESC').page(page).per(per_page)
    else
      @templates = Current.account.templates.order('updated_at DESC')
    end
    total_count = Current.account.templates.count
    render json: { templates: @templates, total_count: total_count }, status: :ok
  end

  # create sms template
  def create
    @template = Current.account.templates.new(template_params)
    if @template.save
      render json: @template, status: :ok, message: "Templates create successfully!"
    else
      render json: @template.errors.full_messages, status: :unprocessable_entity, errors: "Something went wrong!"
    end
  end

  # show sms template
  def show_template
    sender_id = params[:template_id]
    if sender_id.blank?
        render json: {error: "Missing sender_id"}, status: :bad_request
        return
    end

    result = Current.account.templates.where(sender_id: params[:sender_id])

    if result.present?
        render json: { message: "Templates search successfully!", template: result }, status: :ok
    else
        render json: { message: "No results found!"}, status: :ok
    end
  end

  def show
    if @template.present?
      render json: { message: "Templates search successfully!", template: @template }, status: :ok
    else
      render json: { message: "No results found!" }, status: :ok
    end
  end

  # update sms template
  def update
    if @template.update(template_params)
      render json: @template, status: :ok
    else
      render json: { errors: @template.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # delete sms template
  def destroy
    if @template.destroy
      render json: { message: "Template deleted successfully" }, status: :ok
    else
      render json: { errors: "Resource could not be found" }, status: :unprocessable_entity
    end
  rescue StandardError => e
    render json: { errors: e.message }, status: :unprocessable_entity
  end

  # upload sms template
  def upload_template
    if upload_params[:file].blank? || upload_params[:file].content_type != 'text/csv'
      render json: { error: I18n.t('errors.contacts.import.failed') }, status: :unprocessable_entity
    else
      result = Template.upload_template(params[:file], upload_params)
      render json: { message: "Template save successfully", template: result }, status: :ok
    end
  end

  # search entity in template
  def search_template
    if params[:search_term].present?
      result = Current.account.templates.search_query(params[:search_term]).page(params[:page]).per(params[:per_page])
      if result.present?
        total_count = result.count
        render json: { message: "Templates search successfully!", templates: result, total_count: total_count}, status: :ok
      else
        render json: { message: "No results found!" }, status: :ok
      end
    else
      render json: { errors: "Search Term is missing!" }, status: :unprocessable_entity
    end
  end

  def get_template_id_by_sender_id
    template = Current.account.templates.where(sender_id: params[:sender_id]).map{|element| {template_record_id: element.id, template_id: element.template_id, sender_id: element.sender_id}}
    render json: template , status: :ok
  end

  private

  def template_params
    params.require(:template).permit(
      :name, :description, :sender_id, :account_id, :registered_dlt, :telemarketer_id, :pe_id, :message, :template_type, :locale, :template_id
    )
  end

  def upload_params
    params.permit(
      :file, :name, :description, :sender_id, :account_id, :registered_dlt, :telemarketer_id, :pe_id, :message, :account_user_id, :template_type, :locale, :template_id
    )
  end

  def find_template
    @template = Current.account.templates.find(params[:id])
  end
end
