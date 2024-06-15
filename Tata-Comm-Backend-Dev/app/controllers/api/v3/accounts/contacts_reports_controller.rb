class Api::V3::Accounts::ContactsReportsController < Api::V1::Accounts::BaseController
  include Pagination

  before_action :set_report, only: %i[rerun_report download_file]

  def index
    reports = current_user.contact_reports
    reports = reports.search_query(params[:search]) if params[:search]
    current_page = params[:page] || CURRENT_PAGE
    limit = params[:limit] || LIMIT_PER_PAGE
    reports = reports.order_by_desc.page(current_page.to_i).per(limit.to_i)
    render json: { reports: reports, pagination: pagination_values(reports) }, status: :ok
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def rerun_report
    file_header = JSON.unparse(@report.header)
    Segmentation::ExportContactsWorker.perform_async(@report.segment_filter_id, @report.segment_id, file_header, @report.id, Current.account.name)
    @report.update(status: 0)
    render json: { message: I18n.t('segments.contacts_report') }, status: :ok
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def download_file
    obj = S3::S3Service.fetch_aws_object(@report.object_key)
    new_presigned_url = obj.presigned_url(:get)
    @report.s3_file_url = new_presigned_url
    if @report.save!
      render json: { url: @report.s3_file_url }, status: :ok
    else
      render json: { errors: @report.errors }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  private

  def set_report
    @report = current_user.contact_reports.find(params[:id])
  end
end
