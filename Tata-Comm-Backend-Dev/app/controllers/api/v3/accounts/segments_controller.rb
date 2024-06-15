class Api::V3::Accounts::SegmentsController < Api::V1::Accounts::BaseController
  include Api::V3::Accounts::Concerns::SegmentFilterQuery
  include Pagination

  before_action :set_segment,
                only: %i[show update destroy archieve_unarchieve create_duplicate export_segment_users edit edit_file_segment restore_version]
  before_action :set_segment_filter,
                only: %i[query_filter_rerun_success_email query_rerun]
  before_action :check_imports_limit, only: %i[edit_file_segment]

  def index
    segments = params[:archived] == 'true' ? Current.account.segments.archived : Current.account.segments.not_archived
    segments = segments.filter_by_type(params[:segment_types].split(',')) if params[:segment_types]
    segments = segments.search_query(params[:search]) if params[:search]
    current_page = params[:page] || CURRENT_PAGE
    limit = params[:limit] || LIMIT_PER_PAGE
    segments = segments.order_by_desc.page(current_page.to_i).per(limit.to_i)
    render json: { data: ActiveModelSerializers::SerializableResource.new(segments, each_serializer: Segments::IndexSegmentSerializer), pagination: pagination_values(segments) },
           status: :ok
  end

  def show
    render json: { segment: ActiveModelSerializers::SerializableResource.new(@segment, serializer: SegmentsSerializer) }, status: :ok
  end

  def edit
    render json: { segment: ActiveModelSerializers::SerializableResource.new(@segment, serializer: Segments::EditSegmentSerializer) }
  end

  def edit_file_segment
    if @segment.file_segment?
      render json: { error: I18n.t('errors.contacts.import.failed') }, status: :unprocessable_entity and return if params[:import_file].blank?

      ActiveRecord::Base.transaction do
        import_file_segment = ImportFileSegment.new(import_file_segment_params.merge(segment_id: @segment.id))
        import_file_segment.emails = params[:emails].split(',')
        if import_file_segment.save
          import_file_segment.import_file.attach(params[:import_file])
          render json: { message: I18n.t('errors.import_file_segments.successful') }, status: :ok
        else
          render json: { errors: import_file_segment.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end
    else
      render_could_not_create_error(I18n.t('errors.import_file_segments.not_a_file_segment'))
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def validate_param(_param_name, value, validation_condition, error_message)
    unless value.present? && validation_condition
      render_could_not_create_error(error_message)
      return false
    end
    true
  end

  def create
    if params[:created_from] == 'direct_from_filter'
      segment = create_segment_filter_and_segment
    else
      @segment_filter = Current.account.segment_filters.find(params[:segment][:segment_filter_id])
      segment = create_segment
    end

    if segment.save
      render json: { segment: ActiveModelSerializers::SerializableResource.new(segment, serializer: SegmentsSerializer) }, status: :created
    else
      render json: { errors: segment.errors }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_could_not_create_error(e.message)
  end

  def update
    segment_filter_id = params[:segment][:segment_filter_id] || @segment.segment_filter_id
    @segment_filter = Current.account.segment_filters.find_by(filter_hash: set_filter_hash, id: segment_filter_id)
    if @segment_filter.present? && same_segment_filter?
      return render json: { status: 'error', message: "A segment with name #{@segment.name} already exists with the same segment description." },
                    status: :unprocessable_entity
    elsif params[:segment][:segment_filter_id].present?
      @segment.update!(segment_params.merge!('segment_filter_id' => params[:segment][:segment_filter_id]))
    elsif params[:segment][:segment_filter].nil?
      @segment_filter = create_segment_filter
      if params[:save_object] == ACTION_SAVE_AS
        @segment = create_segment
        @segment.save!
      else
        @segment.update!(segment_params.merge!('segment_filter_id' => @segment_filter.id))
      end
    end

    render json: { segment: ActiveModelSerializers::SerializableResource.new(@segment, serializer: SegmentsSerializer) }, status: :ok
  end

  def create_segment_filter_and_segment
    @segment_filter = create_segment_filter
    create_segment
  end

  def create_segment
    segment = Current.account.segments.new(segment_params)
    segment.segment_filter_id = @segment_filter.id
    segment
  end

  def get_user_property_list
    properties = JSON.parse(File.read('./private/user_property/user_property.json'))
    custom_attrs = Current.account.custom_attribute_definitions.with_attribute_model(:contact_attribute)
    custom_attrs = custom_attrs.map do |item|
      { data_types: [item.attribute_display_type], name: item.attribute_key, displayed_name: item.attribute_display_name,
        description: item.attribute_description }
    end
    render json: { user_properties: properties, custom_attributes: custom_attrs }, status: :ok
  end

  def get_user_count_by_filter
    segment_filter = if campaign_flow?
                        segment_filter_exclude_users
                     else
                       create_segment_filter
                     end

    if (segment_filter.present? && segment_filter.instance_of?(SegmentFilter))
      render json: { segment_filter: ActiveModelSerializers::SerializableResource.new(segment_filter, serializer: SegmentFiltersSerializer) },
           status: :ok
    else
      segment = Current.account.segments.find(params[:segment_id])
      render json: { segment_filter: ActiveModelSerializers::SerializableResource.new(segment, serializer: Segments::CampaignSegmentSerializer) },
           status: :ok
    end
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error(e.message)
    render_not_found_error(I18n.t('errors.resource_not_found'))
  end

  def create_segment_filter
    data = generate_raw_sql
    users_count = begin
                    Segment.get_contacts_count(data[:count_raw_sql]).first['count']
                  rescue StandardError => e
                    Rails.logger.error(e.message)
                    ZERO
                  end
    segment_filter = Current.account.segment_filters.create(users_count: users_count, description: data[:query_sentence], filter_hash: set_filter_hash, audience_type: params[:audience_type], exclude_users: params[:exclude_users], last_refreshed_at: DateTime.now)
    Segmentation::SegmentFilterWorker.perform_async(segment_filter.id, data, Current.account.id, params.as_json)
    segment_filter
  end

  def query_rerun
    contact_ids = Segment.get_contact_ids(@segment_filter.sql_query)
    @segment_filter.segment_user_ids.destroy_all
    @segment_filter.update!(users_count: contact_ids.size, status: STATUS_DRAFT)
    Segmentation::RerunSegmentFilter.perform_async(params[:sf_id], contact_ids)
    render json: { segment_filter: ActiveModelSerializers::SerializableResource.new(@segment_filter, serializer: SegmentFiltersSerializer) },
           status: :ok
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_could_not_create_error(e.message)
  end

  def query_filter_rerun_success_email
    email_ids = params[:to_send_email_ids].split(',')
    if Segmentation::FilterQueryEmailWorker.perform_at(5.seconds.from_now, email_ids, @segment_filter.id)
      render json: { data: 'Email notification send successfully for query execution result' },
             status: :ok
    else
      render_could_not_create_error('Email notification fails for query execution result')
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_could_not_create_error(e.message)
  end

  def get_user_events
    search = params[:query]
    user_events = CommonEvent.order('name asc')
    user_events = user_events.where('name ilike (?)', "#{search}%") if search.present?
    render json: { user_events: user_events }, status: :ok
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def get_user_event_attributes
    event_attributes = CommonEventAttribute.where(common_event_id: params[:event_id]).as_json
    render json: { event_attributes: event_attributes }, status: :ok
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def get_custom_segments
    custom_segments = Current.account.segments.not_archived.select(:id, :name, :description).as_json
    render json: { custom_segments: custom_segments }, status: :ok
  end

  def archieve_unarchieve
    @segment.archived_at = @segment.archived ? nil : Time.zone.now
    @segment.archived = !@segment.archived
    if @segment.save
      render json: { message: I18n.t('segments.update_segment') }, status: :ok
    else
      render json: { errors: @segment.errors }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def sample_users_details
    segment = if params['segment_id'].present?
                Segment.find(params['segment_id'])
              else
                SegmentFilter.find(params['segment_filter_id'])
              end
    render json: segment, search_params: params, serializer: Segments::SampleContactsSerializer
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_could_not_create_error(e.message)
  end

  def create_duplicate
    dup_segment = @segment.dup
    if dup_segment.save
      render json: { segment: ActiveModelSerializers::SerializableResource.new(dup_segment, each_serializer: SegmentsSerializer),
                     message: I18n.t('segments.duplicate_segment_creation') }, status: :ok
    else
      render json: { errors: dup_segment.errors }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def export_segment_users
    report = current_user.contact_reports.create(file_name: params[:file_name], description: "Users in segment #{@segment.name}",
                                   segment_filter_id: @segment.segment_filter_id, user_id: Current.user.id, header: params[:file_headers], segment_id: @segment.id)
    if @segment.file_segment?
      Segmentation::ExportContactsWorker.perform_async(nil, @segment.id, params[:file_headers], report.id, Current.account.name)
    else
      Segmentation::ExportContactsWorker.perform_async(@segment.segment_filter_id, nil, params[:file_headers], report.id, Current.account.name)
    end
    report.update(status: 0)
    render json: { message: I18n.t('segments.export_users_message') }, status: :ok
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def export_segment_filter_users
    report = current_user.contact_reports.create(file_name: params[:file_name], description: ContactReport::QUERY_USERS, segment_filter_id: params[:segment_filter_id],
                                   user_id: Current.user.id, header: params[:file_headers])
    Segmentation::ExportContactsWorker.perform_async(params[:segment_filter_id], nil, params[:file_headers], report.id, Current.account.name)
    report.update(status: 0)
    render json: { message: I18n.t('segments.export_users_message') }, status: :ok
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def restore_version
    segment = @segment.versions.find(params[:version_id]).reify
    if segment.save!
      render json: { segment: ActiveModelSerializers::SerializableResource.new(segment, serializer: SegmentsSerializer) }, status: :ok
    else
      render json: { errors: segment.errors }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def campaign_channel_type_list
    render json: { campaign_channel: CAMPAIGN_CHANNEL, campaign_type: CAMPAIGN_TYPE }, status: :ok
  end

  private

  def segment_params
    params.require(:segment).permit(:segment_type, :name, :segment_filter_id, :description, :user_count, :reachable_users_count,
                                    :reachability_percentage_by_channel, :source_type, :sms_camp_reachable_count, :email_camp_reachable_count,
                                    :push_camp_reachable_count, :whatsapp_camp_reachable_count, :sms_camp_reachable_percentage,
                                    :email_camp_reachable_percentage, :push_camp_reachable_percentage, :whatsapp_camp_reachable_percentage, user_ids: [])
  end

  def set_segment
    @segment = Current.account.segments.find(params[:id])
  end

  def set_segment_filter
    @segment_filter = Current.account.segment_filters.find(params[:sf_id])
  end

  def import_file_segment_params
    params.permit(:account_user_id, :event_type, :import_file, emails: [])
  end

  def set_filter_hash
    { included_filters: params[:included_filters], excluded_filters: (params[:excluded_filters] || {}) }.as_json
  end

  def same_segment_filter?
    @segment_filter.id == @segment.segment_filter_id
  end

  def check_imports_limit
    return unless @segment.import_file_segments.size >= NINETEEN

    ifs = @segment.import_file_segments.order(created_at: :asc).first
    ifs.destroy
  end
end
