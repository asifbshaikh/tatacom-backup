class Api::V1::Accounts::CampaignsController < Api::V1::Accounts::BaseController
  before_action :campaign, except: [:index, :create, :reports]
  before_action :check_authorization, except: [:reports]

  def index
    @campaigns = Current.account.campaigns
  end

  def create
    @campaign = Current.account.campaigns.create!(campaign_params)
  end

  def destroy
    @campaign.destroy
    head :ok
  end

  def reports
    Rails.logger.info "!!!!!!!!!!!!!!!!!!!!!!!!!!@######################"
    Rails.logger.info params
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=agents_report.csv'
    # Rails.logger.info "!!!!!!!!!!!!!!!!!!!!!!!!!!@######################"
    # Rails.logger.info Current.account.messages.joins(:conversation).includes(:conversation).where(campaign_id: 96)
    # Rails.logger.info Message.find_by_sql(["SELECT
    # M.content, M.source_id, M.status,
    # CNT.name, CNT.phone_number
    # FROM messages M
    # LEFT JOIN conversations CNVS ON (M.conversation_id = CNVS.id)
    # LEFT JOIN contacts CNT ON (CNVS.contact_id = CNT.id)
    # WHERE M.campaign_id=?", 96])

    # Rails.logger.info Message.connection.select_all("SELECT
    # M.content, M.source_id, M.status,
    # CNT.name, CNT.phone_number
    # FROM messages M
    # LEFT JOIN conversations CNVS ON (M.conversation_id = CNVS.id)
    # LEFT JOIN contacts CNT ON (CNVS.contact_id = CNT.id)
    # WHERE M.campaign_id=96")
    
    # <% Current.account.messages.where(campaign_id: 96).each do |campaign| %>
    # Rails.logger.info Message.connection.select_all("select * from messages where campaign_id=96").to_a
    campaign = Current.account.campaigns.find_by(display_id: params['campaign_id'])
    @campaignTimezone = campaign.inbox.timezone
    render layout: false, template: 'api/v2/accounts/reports/campaigns-basic.csv.erb', format: 'csv'
  end

  def show; end

  def update
    @campaign.update!(campaign_params)
  end

  private

  def campaign
    @campaign ||= Current.account.campaigns.find_by(display_id: params[:id])
  end

  def campaign_params
    params.require(:campaign).permit(:title, :description, :message, :enabled, :trigger_only_during_business_hours, :inbox_id, :sender_id,
                                     :scheduled_at, audience: [:type, :id, :title], trigger_rules: {})
  end
end
