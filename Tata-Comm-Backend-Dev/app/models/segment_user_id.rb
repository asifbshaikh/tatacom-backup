# == Schema Information
#
# Table name: segment_user_ids
#
#  id                :bigint           not null, primary key
#  user_ids          :text             default([]), is an Array
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  segment_filter_id :bigint           not null
#
# Indexes
#
#  index_segment_user_ids_on_segment_filter_id  (segment_filter_id)
#
class SegmentUserId < ApplicationRecord
  belongs_to :segment_filter
end
