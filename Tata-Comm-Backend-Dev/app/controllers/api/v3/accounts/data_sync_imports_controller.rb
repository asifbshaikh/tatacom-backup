class Api::V3::Accounts::DataSyncImportsController < Api::V1::Accounts::BaseController
  include Pagination

  before_action :set_import, only: %i[show]

  def index
    imports = Current.account.data_sync_imports.filter_by_type(params[:type]).order_by_desc
    imports = imports.page(page.to_i).per(per_page.to_i)
    render json: {
             imports: imports,
             pagination: pagination_values(imports)
           },
           status: :ok
  end

  def show
    render json: { import: @import }, status: :ok
  end

  private

  def set_import
    @import = Current.account.data_sync_imports.find(params[:id])
  end
end
