class Api::V3::Accounts::CustomAttributesEventsController < Api::V1::Accounts::BaseController
  def create_custom_event
    custom_event_check = CommonEvent.find_by(name: custom_event_params[:name], account_id: custom_event_params[:account_id])
    return render json: { error: I18n.t('segments.existing_event') }, status: :unprocessable_entity if custom_event_check.present?

    custom_event = CommonEvent.new(custom_event_params)
    custom_event.category = CommonEvent::CUSTOM
    if custom_event.save!
      render json: { custom_event: custom_event }, status: :created
    else
      render json: { errors: custom_event.errors }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_could_not_create_error(e.message)
  end

  def map_custom_event
    contact_common_event = ContactCommonEvent.new(contact_common_event_params)
    if contact_common_event.save!
      render json: { contact_common_event: contact_common_event }, status: :created
    else
      render json: { errors: contact_common_event.errors }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_could_not_create_error(e.message)
  end

  private

  def custom_event_params
    params.require(:custom_event).permit(:name, :displayed_name, :description, :property_name, :type, :account_id, source: [])
  end

  def contact_common_event_params
    params.require(:map_custom_event).permit(:common_event_id, :contact_id, :value)
  end
end
