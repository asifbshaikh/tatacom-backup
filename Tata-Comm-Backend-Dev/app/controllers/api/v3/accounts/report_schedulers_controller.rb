class Api::V3::Accounts::ReportSchedulersController < Api::V1::Accounts::BaseController
  before_action :set_report_scheduler, only: %i[ show edit update destroy ]

  def index
    @report_schedulers = Current.account&.report_schedulers
  end

  def show
  end

  def new
    @report_scheduler = ReportScheduler.new
  end

  def edit
  end

  def create
    @report_scheduler = ReportScheduler.new(report_scheduler_params)
    if @report_scheduler.save
      render json: { data: @report_scheduler }
    else
      render json: { error: @report_scheduler.errors, status: :unprocessable_entity }
    end
  end

  def update
    if @report_scheduler.update(report_scheduler_params)
      render json: { data: @report_scheduler }
    else
      render json: { error: @report_scheduler.errors, status: :unprocessable_entity }
    end
  end

  def destroy
    @report_scheduler.destroy
    render json: { message: I18n.t('report_schedulers.delete_success') }
  end

  private

    def set_report_scheduler
      @report_scheduler = ReportScheduler.find(params[:id])
    end

    def report_scheduler_params
      params.require(:report_scheduler).permit(:report_type, :status, :scheduling_frequency, :start_date, :end_date, :repeat_every, :max_occurrence, :occurrence_count, :api_enabled, :account_id, campaign_ids:[], repeat_on_day_of_week:[], repeat_on_day_of_month:[])
    end
end
