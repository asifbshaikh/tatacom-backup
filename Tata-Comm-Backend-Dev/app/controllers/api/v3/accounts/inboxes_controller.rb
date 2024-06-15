class Api::V3::Accounts::InboxesController < Api::V1::Accounts::InboxesController
  include Pagination

  def index
    @inboxes = Current.account.inboxes
    @inboxes = @inboxes.where(channel_type: CHANNEL_MAPPING[params[:channel_type]].to_s) if params[:channel_type].present?
    @inboxes = @inboxes.where.not(channel_id: nil) if params[:channel_available].present?
    @inboxes = @inboxes.page(page_number.to_i).per(page_limit.to_i).order('created_at DESC')
    @pagination_values = pagination_values(@inboxes)
  end

  def create
    verify_channel_association_with_inbox
    @inbox = Current.account.inboxes.create!(permitted_params)
  rescue StandardError => error
    Rails.logger.info error.message
    render_could_not_create_error(error.message)
  end

  def update
    verify_channel_association_with_inbox
    if @inbox.update!(update_inbox_params)
      @inbox.update_working_hours(working_hours_params) if params[:working_hours]
      render :update
    end
  rescue StandardError => error
    Rails.logger.info error.message
    render_could_not_create_error(error.message)
  end

  def destroy
    if @inbox.channel.present?
      render json: { message: 'Channel is connected for this inbox' }, status: :unprocessable_entity
    else
      @inbox.update(name: "archived-#{@inbox.id}-#{@inbox.name}")
      @inbox.destroy
      @inbox.conversations.update_all(deleted_at: Time.now) if @inbox.conversations.present?
      head :ok
    end
  end

  private

  def verify_channel_association_with_inbox
    if params[:channel_id].present?
      inbox = Current.account.inboxes.find_by(channel_id: params[:channel_id])
      return if inbox&.channel_id == @inbox&.channel_id
      raise 'Channel already linked with other inbox' if inbox.channel_id.present?
    end
  end

  def page_number
    params[:page] || CURRENT_PAGE
  end

  def page_limit
    params[:per_page] || LIMIT_PER_PAGE
  end

  def permitted_params()
    params[:channel_type] = CHANNEL_MAPPING[params[:channel_type]].to_s
    params.permit(
      :name, :avatar, :greeting_enabled, :greeting_message, :enable_email_collect, :csat_survey_enabled,
      :enable_auto_assignment, :working_hours_enabled, :out_of_office_message, :timezone, :allow_messages_after_resolved, :channel_type, :channel_id
    )
  end

  def update_inbox_params
    params.permit(
      :name, :avatar, :greeting_enabled, :greeting_message, :enable_email_collect, :csat_survey_enabled,
      :enable_auto_assignment, :working_hours_enabled, :out_of_office_message, :timezone, :allow_messages_after_resolved
    )
  end

  def channel_params(channel_attributes = [])
    params.permit(channel: [:type, *channel_attributes])
  end

  def working_hours_params
    params.permit(working_hours: Inbox::OFFISABLE_ATTRS)[:working_hours]
  end

end
