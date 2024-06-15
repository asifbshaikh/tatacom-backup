require 'csv'
module ExportCsv
  extend ActiveSupport::Concern

  def to_csv(campaigns)
    CSV.generate(headers: true) do |csv|
      csv << CSV_PDF_EXCEL_HEADERS
      campaigns.each_with_index do |campaign, index|
        csv << campaign_attributes(index + 1, campaign)
      end
    end
  end

  def send_csv_data(campaigns)
    start_date = params['start_date']
    end_date = params['end_date']
    if start_date.present? && end_date.present?
      filename = "#{Date.parse(start_date).strftime('%Y%m%d')}_to_#{Date.parse(end_date).strftime('%Y%m%d')}"
      send_data to_csv(campaigns), filename: "#{filename}.csv", type: 'text/csv'
    else
      render json: { message: I18n.t('campaigns.errors.date_required') }, status: :unprocessable_entity, content_type: 'application/json'
    end
  end
end
