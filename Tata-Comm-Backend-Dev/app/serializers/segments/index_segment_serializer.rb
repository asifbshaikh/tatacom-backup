class Segments::IndexSegmentSerializer < ActiveModel::Serializer
  attributes :id, :name, :segment_type, :archived, :created_at, :last_run_at

  def created_at
    object.created_at.to_i
  end

  def last_run_at
    object.last_run_at.to_i
  end

end
