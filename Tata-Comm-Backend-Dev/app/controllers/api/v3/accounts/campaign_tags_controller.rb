class Api::V3::Accounts::CampaignTagsController < Api::V1::Accounts::BaseController
  before_action :check_authorization

  def create
    message = !params[:name].present? ? I18n.t('campaign_tags.errors.name') : !params[:campaign_id].present? ? I18n.t('campaign_tags.errors.campaign_id') : !params[:group_tag_id].present? ? I18n.t('campaign_tags.errors.group_tag_id') : ""
    campaign = Current.account.campaigns.find_by(id: params[:campaign_id])
    group_tag = GroupTag.find_by(id:params[:group_tag_id])
    if campaign.present? &&  group_tag.present? && params[:name].present?
      campaign_tag = campaign.campaign_tags.new(campaign_tags_params)
      campaign_tag.save
      render json: { message: I18n.t('campaign_tags.success.created'), data: campaign_tag }, status: :ok
    elsif !campaign.present?
      render json: { message: I18n.t('campaign_tags.errors.campaign_not_found')}, status: :ok
    else
      render json: { message: message}, status: :ok
    end
  end

  def index
    # @campaign_tags = CampaignTag.page(page).per(per_page)
    # render json: { campaign_tags: @campaign_tags }, status: :ok
    render json: []
  end

  private
    def campaign_tags_params
      params.require(:campaign_tag).permit(:name, :description, :campaign_id, :group_tag_id,custom_attributes:{})
    end
end
