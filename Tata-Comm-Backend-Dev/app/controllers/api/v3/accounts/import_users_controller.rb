class Api::V3::Accounts::ImportUsersController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :set_accout_user, only: [:import]

  def index
    params[:page] = params[:page].present? ? params[:page].to_i : 1
    result_per_page = params[:result_per_page].present? ? params[:result_per_page].to_i : 10
    import_users = Current.account.account_users.find_by(user_id: params[:user_id])&.import_users
    if params.present? && params[:user_id].present? && import_users.present?
      @total_record = import_users.count || 0
      @import_users = import_users.order(created_at: :desc).page(params[:page]).per(result_per_page)
    else
      render json: {}.to_a
    end
  end

  def new
    @import = ImportUser.new
  end

  def import
    if params[:file].blank?
      render json: { error: I18n.t('errors.contacts.import.failed') }, status: :unprocessable_entity
      return
    end
    ActiveRecord::Base.transaction do
      validation_result = true

      if import_params[:user_type] == 'registered'
        validation_result = validate_param(:identifier, import_params[:identifier], import_params[:identifier] == 'customer_id', "For registered users, identifier must be 'customer id'.")
        validation_result &&= validate_param(:col_types, import_params[:col_types], import_params[:col_types].values.any? { |value| value.key?("customer_id") }, "For registered users 'customer id' must be present.")
      else
        validation_result = validate_param(:identifier, import_params[:identifier], %w[email phone_number email&phone_number].include?(import_params[:identifier]), "For anonymous users, identifier must be 'email' and 'phone number'.")
        validation_result &&= validate_param(:col_types, import_params[:col_types], import_params[:col_types].values.any? { |value| value.key?("email") }, "For anonymous users email must be present.")
        validation_result &&= validate_param(:col_types, import_params[:col_types], import_params[:col_types].values.any? { |value| value.key?("phone_number") }, "For anonymous users phone number must be present.")
      end
      if validation_result
        if import_params[:custom_segment].present?
          custom_segment = Current.account.segments.create!(segment_type: FILE, name: import_params[:custom_segment], source_type: IMPORT_AUDIENCE, description: create_description)
          import_user = Current.account.import_users.new(import_params.merge(custom_segment_id: custom_segment.id, account_user_id:  @account_user.id))
        else
          import_user = Current.account.import_users.new(import_params.merge(account_user_id: @account_user.id))
        end
        if import_user.save
          import_user.import_file.attach(params[:file])
          render json: {message: "File imported successfully"}, status: :ok
        else
          render json: {errors: import.errors.full_messages}, status: :unprocessable_entity
        end
      end
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_could_not_create_error(e.message)
  end

  def user_attribute_mapping
    begin
      columns_to_skip = ["id", "source_id", "creation_source", "account_id", "created_at", "updated_at", "custom_attributes", "additional_attributes", "import_user_id"]
      columns = Contact.columns_hash.select{|name,_| columns_to_skip.exclude?(name) }
      results = {}
      columns.each do |name, column|
        results[name.to_sym] = {'name'=> name.titleize(keep_id_suffix: true), 'type'=> column.type.to_s }
      end

      CONTACT_ADDITIONAL_ATTRIBUTES.each do |name|
        results[name.to_sym] = {'name'=> name.titleize, 'type'=> 'string'}
      end

      custom_attribute = CustomAttributeDefinition.where(account_id: params[:account_id]).with_attribute_model(:contact_attribute)
      if custom_attribute.present?
        custom_attribute.each do |attr_values|
          results[attr_values.attribute_key.to_sym] = {'name'=> attr_values.attribute_display_name, 'type'=> (attr_values.attribute_display_type == "text" ? "string" : attr_values.attribute_display_type)}
        end
      end
      render json:{response: results, status: 200 }
    rescue StandardError => e
      render json: { error: e.message }.to_json, status: :unprocessable_entity
    end
  end

  private

  def set_accout_user
    @account_user = Current.account.account_users.find_by(user_id: import_params[:account_user_id])
  end

  def import_params
    import_user_params = JSON.parse(params[:import_user]).with_indifferent_access
    {
      account_user_id: import_user_params[:user_id],
      user_type: import_user_params[:user_type],
      file_url: import_user_params[:file_url],
      file_name: import_user_params[:file_name],
      custom_segment: import_user_params[:custom_segment],
      update_existing_user: import_user_params[:update_existing_user],
      identifier: import_user_params[:identifier],
      has_header: import_user_params[:has_header],
      new_custom_attributes: (import_user_params[:custom_attribute_name]&.values rescue {}),
      skipped_col: import_user_params[:skipped_col],
      col_types: import_user_params[:col_types]
        }
  end

  def validate_param(param_name, value, validation_condition, error_message)
    unless value.present? && validation_condition
      render_error(error_message, :unprocessable_entity)
      return false
    end
    true
  end

  def render_error(message, status)
    render json: { error: message }, status: status
  end

  def create_description
    "created from file: #{Current.account.name} is uploaded file_with_name '#{params[:file]&.original_filename}' on #{Time.now.strftime('%d %b %Y %l:%M %P')}"
  end
end
