require 'caxlsx'
module ExportExcel
  extend ActiveSupport::Concern

  include Api::V3::Accounts::CampaignsHelper

  def to_excel(campaigns)
    package = Axlsx::Package.new
    workbook = package.workbook
    workbook.add_worksheet do |sheet|
      sheet.add_row CSV_PDF_EXCEL_HEADERS
      campaigns.each_with_index do |campaign, index|
        sheet.add_row campaign_attributes(index + 1, campaign)
      end
    end
    package.to_stream.read
  end

  def send_excel_data(campaigns)
    start_date = params['start_date']
    end_date = params['end_date']
    if start_date.present? && end_date.present?
      filename = "#{Date.parse(start_date).strftime('%Y%m%d')}_to_#{Date.parse(end_date).strftime('%Y%m%d')}"
      send_data to_excel(campaigns), filename: "#{filename}.xlsx", type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    else
      render json: { message: I18n.t('campaigns.errors.date_required') }, status: :unprocessable_entity, content_type: 'application/json'
    end
  end
end
