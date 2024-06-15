require 'prawn'
require 'prawn/table'
module ExportPdf
  extend ActiveSupport::Concern

  include Api::V3::Accounts::CampaignsHelper

  def to_pdf(campaigns)
    # this code logic only work for 15 columns
    pdf = Prawn::Document.new(:page_size => 'A2', page_layout: :landscape)
    pdf.text 'Campaigns Report', size: 24, align: :center
    pdf.move_down 20

    data = []
    data << CSV_PDF_EXCEL_HEADERS

    campaigns.each_with_index do |campaign, index|
      attributes = campaign_attributes(index + 1, campaign)
      attributes = attributes.map(&:to_s)
      data << attributes
    end
    pdf.table(data, header: true, width: 1600)
    pdf.render
  end

  def send_pdf_data(campaigns)
    start_date = params['start_date']
    end_date = params['end_date']
    if start_date.present? && end_date.present?
      filename = "#{Date.parse(start_date).strftime('%Y%m%d')}_to_#{Date.parse(end_date).strftime('%Y%m%d')}"
      send_data to_pdf(campaigns), filename: "#{filename}.pdf", type: 'application/pdf'
    else
      render json: { message: I18n.t('campaigns.errors.date_required') }, status: :unprocessable_entity, content_type: 'application/json'
    end
  end
end
