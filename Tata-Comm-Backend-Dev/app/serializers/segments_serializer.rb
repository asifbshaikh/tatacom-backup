class SegmentsSerializer < ActiveModel::Serializer
  attributes :segment_details, :reachable_users, :sample_users, :revision_history, :import_file_url

  def segment_details
    {
      id: object.id,
      name: object.name,
      type: object.segment_type,
      created_on: object.created_at.to_i,
      source_type: object.source_type&.titleize,
      description: object.description_string,
      last_run_at: object.last_run_at.to_i
    }
  end

  def reachable_users
    if object.file_segment?
      object.file_reachable_users
    else
      object.segment_filter&.reachable_users
    end
  end

  def sample_users
    if object.file_segment?
      Contact.where('source_id @> ARRAY[?]', object.id).order_by_desc.limit(SAMPLE_USER_COUNT).order_by_desc.select('id, name').as_json
    else
      begin
        contact_ids = object.segment_filter.segment_user_ids&.first&.user_ids
        Contact.where('id IN(?)', contact_ids).order_by_desc.limit(SAMPLE_USER_COUNT).as_json(only: [:id, :name])
      rescue StandardError => e
        Rails.logger.error(e.message)
      end
    end
  end

  def revision_history
    if object.file_segment?
      object.file_revision_history
    else
      object.filter_revision_history
    end
  end

  def import_file_url
    object.import_file_url
  end
end
