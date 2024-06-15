class Api::V3::Accounts::CampaignGoalsController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :set_goals, only: [:show, :update]


  def create
    campaign_goal = Current.account.campaigns.find_by(id: goal_params[:campaign_id]).campaign_goals.new(goal_params.merge(account_id: params[:account_id]))
    if campaign_goal.save
      campaign_goal.create_goal_events(params[:campaign_goals][:goal_events])
      render json: { message: "Campaign goal Created successfully!", data: campaign_goal }, status: :ok
    else
      render json: { errors: campaign_goal.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def show
    if @campaign_goal.present?
      render json: { data: @campaign_goal }, status: :ok
    else
      render json: { message: "Resource could not be found"}, status: :not_found
    end
  end
  
  def update
    if @campaign_goal.update(goal_params)
      render json: { data: @campaign_goal }, status: :ok
    else
      render json: { errors: @campaign_goal.errors.full_messages }, status: :unprocessable_entity
    end
  end


  private
 
  def goal_params
    params.require(:campaign_goals).permit(:campaign_id, :account_user_id, :name, :attribution_window, :attribution_window_type, :capping_enabled, :frequency_capping_count)
  end

  def set_goals
    @campaign_goal = Current.account.campaign_goals.find(params[:id])
  end
end
