class Segmentation::RerunSegmentFilter < SidekiqBase
  queue_as :high

  BREAK_ARRAY = 1_000_000

  def perform(sf_id, contact_ids)
    start_time = Time.now
    segment_filter = SegmentFilter.find(sf_id)
    contact_ids.each_slice(BREAK_ARRAY).to_a.each do |batch_size|
      segment_filter.segment_user_ids.create(user_ids: batch_size)
    end

    segment_filter.update!(status: 'active', success_at: DateTime.now) if compare_array_size_to_users_count(segment_filter)
    finish_time = Time.now
    Rails.logger.info "****************************Time Taken in SegmentFilterWorker: #{finish_time-start_time} seconds***************"
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def compare_array_size_to_users_count(segment_filter)
    segment_filter.segment_user_ids.pluck(:user_ids).sum(&:size) == segment_filter.users_count
  end
end
