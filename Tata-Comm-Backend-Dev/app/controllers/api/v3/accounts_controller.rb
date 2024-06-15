class Api::V3::AccountsController < Api::V1::AccountsController
  include Api::V3::Accounts::Concerns::CustomAccessTokenGenerator
  include Pagination

  before_action :fetch_account, except: [:generate_access_token, :create_event_log]
  before_action :validate_account_setting, only:[:generate_access_token]
  skip_before_action :authenticate_user!, raise: false, only:[:generate_access_token, :create_event_log]
  before_action :validate_access_token, only: [:create_event_log]
  before_action :check_authorization

  def setting
    render json: {result: @account.account_setting.as_json}, status: :ok
  end

  def generate_access_token
    if @account_setting.access_token.nil? || @account_setting.token_expires_at < Time.now.utc
      generate_custom_access_token(account_setting_params)
    end
  end

  def create_event_log
    @account = Account.find(params['id'])
    contact = get_contact
    Account.transaction do
      update_or_create_device(contact)
      update_or_create_common_event(contact)
    end
    render json: { message: 'Event logged successfully' }, status: :ok
  rescue StandardError => e
    Rails.logger.error("Error in create_event_log: #{e.message}")
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def get_event_log
    current_page = params[:page] || CURRENT_PAGE
    limit = params[:result_per_page] || LIMIT_PER_PAGE
    @contact_events = @account.contact_common_events.includes(:common_event, :contact_device_detail).order(created_at: :desc).page(current_page.to_i).per(limit.to_i)
    @pagination_values = pagination_values(@contact_events)
  end

  private

  def validate_account_setting
    @account_setting = AccountSetting.authenticate!(account_setting_params['app_id'], params['id'])
    unless  @account_setting
      render json: { error: 'Invalid app_id' }, status: :unprocessable_entity
    end
  end

  def account_setting_params
    params.require(:account_setting).permit(:app_id, :api_key, :account_id)
  end

  def event_log_params
    params.require(:event_log).permit(
      user_attributes: [
        :unique_user_id, :logged_in_status, :customer_id, :first_name, :last_name, :email,
        :mobile, :gender, :birthdate, :location, :push_opt_in_status_ios,
        :user_push_preference, :tcl_engage_push_opted_out, properties: {}, location: [:latitude, :longitude]
      ],
      device_attributes: [
        :advertising_identifier, :vender_identifier, :model_name, :model,
        :os_version, :device_timezone, :device_token, :model_version, :api_level,
        :product_name, :manufacturer, :android_id, :gaid, :gaid_tracking_status,
        :carrier, :device_density, :device_width, :device_height, :network_type, :moe_first_visit, :url, :moe_logged_in_status,
      ],
      event: [
        :name, :app_version, :sdk_version, :platform, :category, :source, :product_url
      ])
  end

  def user_attribute_params
    params.require(:event_log).permit(
      user_attributes: [
        :unique_user_id, :logged_in_status, :push_opt_in_status_ios,
        :user_push_preference, :tcl_engage_push_opted_out, properties: {},  location: [:latitude, :longitude]
      ])
  end

  def event_params
    params.require(:event_log).permit(
      event: [:app_version, :sdk_version, :platform, :product_url])
  end

  def update_or_create_device(contact)
    device_params = event_log_params['device_attributes']
    user_att_params = user_attribute_params['user_attributes']
    if contact.present?
      device_params = device_params.merge(contact_id: contact&.id)
      user_att_params = user_att_params.merge(contact_id: contact&.id)
    end
    device = @account.devices.find_or_initialize_by(unique_user_id: user_attribute_params['user_attributes']['unique_user_id'])
    device.update!(device_params)
    contact_device_details = @account.contact_device_details.find_or_initialize_by(unique_user_id: user_attribute_params['user_attributes']['unique_user_id'])
    contact_device_details.update!(user_att_params.merge(device_id: device.id))
  end

  def update_or_create_common_event(contact)
    event_name = event_log_params[:event][:name]
    common_event = @account.common_events.find_or_initialize_by(name: event_name)
    if common_event.new_record?
      common_event.category = event_log_params[:event][:category]
      common_event.source = event_log_params[:event][:source]
      common_event.displayed_name = event_name&.titleize
      common_event.save!
    end
    contact_common_event = @account.contact_common_events.create!(common_event_id: common_event.id, account_id: @account.id, unique_user_id: user_attribute_params['user_attributes']['unique_user_id'])
    if contact.present?
      contact_common_event.contact_id = contact.id
    end
    contact_common_event.assign_attributes(event_params[:event])
    contact_common_event.save!
  end

  def get_contact
    if event_log_params['user_attributes']['logged_in_status'] && event_log_params['user_attributes']['customer_id'].present?
      contact = @account.contacts.find_or_initialize_by(customer_id: event_log_params['user_attributes']['customer_id'])
      if contact.new_record?
        contact_params = event_log_params['user_attributes']
        contact_attr_params = {email: contact_params['email'], first_name: contact_params['first_name'],
        gender: contact_params['gender'], birth_date: contact_params['last_name'], last_name: contact_params['last_name']}
        contact_attr_params['phone_number']= "+#{contact_params['mobile']}" if contact_params['mobile'].present?
        contact.assign_attributes(contact_attr_params)
        contact.save!
      end
      contact
    end
  end
end
