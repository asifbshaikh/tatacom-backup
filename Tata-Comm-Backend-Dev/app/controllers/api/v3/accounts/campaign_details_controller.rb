class Api::V3::Accounts::CampaignDetailsController < Api::V1::Accounts::BaseController

  before_action :set_campaign_details, only: [:show_campaign_details, :update, :destroy]

  def show_campaign_details
    @campaign_detail.present?
    render json: { campaign_detail: @campaign_detail, status: :ok }
  rescue StandardError => e
    Rails.logger.error "#{e.message}"
    render_could_not_create_error(e.message)
  end

  def create
    campaign_id = params[:campaign_detail][:campaign_id]
    campaign =  Current.account.campaigns.find_by(id: campaign_id)
    if campaign_id.present? && campaign.present?
      @campaign_detail = campaign.campaign_details.new(campaign_detail_params.merge!(account_id: Current.account.id))
      if @campaign_detail.save
        render json: @campaign_detail, message: "Campaign Details create successfully!", status: :ok
      else
        render json: @campaign_detail.errors.full_messages, status: :unprocessable_entity
      end
    else
      render json: { message: "Campaign not found!"}, status: :unprocessable_entity
    end
  end

  def update
    @campaign_detail.update(campaign_detail_params)
    render json: @campaign_detail, message: "Campaign Details updated successfully!", status: :ok
  rescue StandardError => e
    Rails.logger.error "#{e.message}"
    render_could_not_create_error(e.message)
  end

  #TODO: Not sure that will need destroy api or not but added it for now
  def destroy
    @campaign_detail.destroy
    render json: { message: "Campaign Details deleted successfully" }, status: :ok
  rescue StandardError => e
    Rails.logger.error "#{e.message}"
    render_could_not_create_error(e.message)
  end

  private

  def set_campaign_details
    @campaign_detail = Current.account.campaign_details.find_by(campaign_id: params[:campaign_detail][:campaign_id])
    render json: { errors: "Resource could not be found" }, status: :not_found and return unless @campaign_detail.present?
  end

  def campaign_detail_params
    params.require(:campaign_detail).permit(:subject, :sender_name, :preview_text, :campaign_id, :channel_email_id, :account_id, :from_email_address, :reply_to_email_address, cc_email_address: [], bcc_email_address: [])
  end
end