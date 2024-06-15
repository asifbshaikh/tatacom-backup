class Segments::EditSegmentSerializer < ActiveModel::Serializer
  attributes :id, :segment_type, :account_id, :name, :last_run_at, :segment_filter

  def segment_filter
    object.segment_filter.as_json(only: %i[id description account_id filter_hash audience_type exclude_users])
  end

  def last_run_at
    object.last_run_at.to_i
  end
end