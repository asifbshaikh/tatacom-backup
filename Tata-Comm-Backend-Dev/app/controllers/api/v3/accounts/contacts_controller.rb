  require 'telephone_number'
class Api::V3::Accounts::ContactsController < Api::V1::Accounts::BaseController
  before_action :get_audience, except: []
  before_action :check_authorization
  before_action :set_contact, only: [:simulate_interaction, :best_time_to_send]

  def contact_phone_numbers
    if @target_audience.present?
      target_audience = @target_audience
      render json:{ data: target_audience.pluck(:id,:phone_number)}, status: :ok
    else
      render json:{ message: I18n.t('user_audience.contact_not_found')}, status: :ok
    end
  end

  def user_audience_count
    audience_count = @target_audience.count
    render json:{audience_count: audience_count}, status: :ok
  end

  def select_target_audience
    if @target_audience.present?
      target_audience = @target_audience
      render json:{ data: target_audience.pluck(:id,:name)}, status: :ok
    else
      render json:{ message: I18n.t('user_audience.contact_not_found')}, status: :ok
    end
  end

  def simulate_interaction
    if @contact.simulate_interaction
      render json: @contact, status: :ok
    else
      render json: @contact.errors.full_messages, status: :unprocessable_entity, errors: "Something went wrong!"
    end
  end

  def best_time_to_send
    last_interaction = @contact.last_interaction_at
    best_time = last_interaction + 2.hours
    render json: {best_time_to_send: best_time}, status: :ok
  end

  def test_phone_number_validity
    phone_number = params[:phone_number]

    phone_object = TelephoneNumber.parse(phone_number)

    if phone_object.valid?
      render json: {message: 'valid'}, status: :ok
    else
      render json: {message: 'invalid'},status: :unprocessable_entity
    end
  end

  private

  def get_audience
    @target_audience = Current.account.contacts
  end

  def set_contact
    @contact = Contact.find(params[:id])
  end
end
