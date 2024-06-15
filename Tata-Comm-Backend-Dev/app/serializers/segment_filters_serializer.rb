class SegmentFiltersSerializer < ActiveModel::Serializer
  attributes :id, :description, :status, :segment, :users_count, :reachable_users, :created_at, :sample_users, :audience_type, :exclude_users

  def reachable_users
    object.reachable_users
  end

  def segment
    { segment_id: object.segment&.id, segment_name: object.segment&.name }
  end

  def users_count
    object.users_count.to_i
  end

  def sample_users
    contact_ids = object.segment_user_ids&.first&.user_ids
    Contact.where("id IN(?)", contact_ids).order_by_desc.limit(SAMPLE_USER_COUNT).as_json(only: [:id, :name]) rescue []
  end

  def created_at
    object.created_at.to_i
  end
end
