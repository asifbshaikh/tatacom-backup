class Segments::CampaignSegmentSerializer < ActiveModel::Serializer
  attributes :segment, :reachable_users, :description

  def segment
    { segment_id: object.id, segment_name: object.name, segment_type: object.segment_type }
  end

  def reachable_users
    object.file_reachable_users
  end
end
