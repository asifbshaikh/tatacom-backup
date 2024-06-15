class Api::V3::Accounts::SegmentFiltersController < Api::V1::Accounts::BaseController
  def index
    segment_filters = Current.account.segment_filters.order_by_desc.limit(TWENTY)
    render json: { list_query_result: ActiveModelSerializers::SerializableResource.new(segment_filters, each_serializer: SegmentFiltersSerializer) },
           status: :ok
  end

  def show
    segment_filter = Current.account.segment_filters.find(params[:id])
    render json: { list_query_result: ActiveModelSerializers::SerializableResource.new(segment_filter, serializer: SegmentFiltersSerializer) },
           status: :ok
  end
end
