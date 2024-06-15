class Segmentation::SegmentFilterWorker < SidekiqBase
  queue_as :high

  BREAK_ARRAY = 1_000_000

  def perform(sf_id, data, account_id, sf_params)
    start_time = Time.now
    account = Account.find_by_id(account_id)
    sf = account.segment_filters.find_by_id(sf_id)
    return unless account.present? || sf.present?
    sf_data = create_segment_filter(sf, data, account, sf_params)
    sf_data[:contact_ids].each_slice(BREAK_ARRAY).to_a.each do |batch_size|
      sf_data[:segment_filter].segment_user_ids.create(user_ids: batch_size)
    end

    sf_data[:segment_filter].update!(status: 'active', success_at: DateTime.now) if compare_array_size_to_users_count(sf_data[:segment_filter])
    finish_time = Time.now
    Rails.logger.info "****************************Time Taken in SegmentFilterWorker: #{finish_time-start_time} seconds***************"
  rescue StandardError => e
    Rails.logger.error(e.message)
  end

  def compare_array_size_to_users_count(segment_filter)
    segment_filter.segment_user_ids.pluck(:user_ids).sum(&:size) == segment_filter.users_count
  end

  def create_segment_filter(sf, data, account, params)
    contact_ids = Segment.get_contact_ids(data['raw_sql'])
    sms_reachability = Segment.sms_reachability(contact_ids, account.id)
    email_reachability = Segment.email_reachability(contact_ids, account.id)
    total_reachable_users = Segment.total_reachable_users(
      sms_reachability[:sms_reachable_users],
      email_reachability[:email_reachable_users]
    )
    sf.update!(
      sql_query: data['raw_sql'],
      users_count: contact_ids.uniq.size,
      sms_reachability: sms_reachability.except!(:sms_reachable_users),
      email_reachability: email_reachability.except!(:email_reachable_users),
      total_reachable_users: total_reachable_users
    )
    { segment_filter: sf.reload, contact_ids: contact_ids }
  end
end
