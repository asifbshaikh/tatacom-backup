# == Schema Information
#
# Table name: segments
#
#  id                                 :bigint           not null, primary key
#  archived                           :boolean          default(FALSE)
#  archived_at                        :datetime
#  description                        :text
#  email_camp_reachable_count         :integer
#  email_camp_reachable_percentage    :float
#  last_run_at                        :datetime
#  name                               :string
#  push_camp_reachable_count          :integer
#  push_camp_reachable_percentage     :float
#  reachability_percentage_by_channel :float
#  reachable_users_count              :bigint
#  segment_type                       :string
#  sms_camp_reachable_count           :integer
#  sms_camp_reachable_percentage      :float
#  source_type                        :string
#  user_count                         :bigint
#  user_ids                           :text             default([]), is an Array
#  whatsapp_camp_reachable_count      :integer
#  whatsapp_camp_reachable_percentage :float
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  account_id                         :bigint           not null
#  segment_filter_id                  :bigint
#
# Indexes
#
#  index_segments_on_account_id         (account_id)
#  index_segments_on_segment_filter_id  (segment_filter_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#

#  last_run_time                      :datetime
#  archived                          :boolean          default(FALSE)
#  description                        :text
#  email_camp_reachable_count         :integer
#  email_camp_reachable_percentage    :float
#  archived_at                :datetime
#  name                               :string
#  push_camp_reachable_count          :integer
#  push_camp_reachable_percentage     :float
#  reachability_percentage_by_channel :float
#  reachable_users_count              :integer
#  segmentable_type                   :string           not null
#  sms_camp_reachable_count           :integer
#  sms_camp_reachable_percentage      :float
#  source_type                        :string
#  user_count                         :integer
#  user_ids                           :integer          is an Array
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  account_id                         :bigint           not null
#  segment_filter_id                  :bigint
#  segmentable_id                     :bigint           not null
#
# Indexes
#
#  index_segments_on_account_id         (account_id)
#  index_segments_on_segment_filter_id  (segment_filter_id)
#  index_segments_on_segmentable        (segmentable_type,segmentable_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#
class Segment < ApplicationRecord
  belongs_to :account
  belongs_to :segment_filter, optional: true
  has_paper_trail on: [:update]
  has_many :import_file_segments, dependent: :destroy_async

  scope :search_query, ->(search_term) { where('name ILIKE ?', "%#{search_term}%") }
  scope :filter_by_type, ->(filter_type) { where(segment_type: filter_type) }
  scope :not_archived, -> { where(archived: false) }
  scope :archived, -> { where(archived: true) }
  scope :order_by_desc, -> { order(created_at: :desc) }

  validates :name, presence: true

  def self.get_contact_ids(raw_sql)
    ActiveRecord::Base.connection.execute(raw_sql).pluck('id')
  end

  def self.get_contacts_count(raw_sql)
    ActiveRecord::Base.connection.execute(raw_sql)
  end

  def self.segment_details(segments)
    segments.select(:id, :name, :segment_type, :archived, :created_at, :last_run_at).as_json
  end

  def self.sms_reachability(contact_ids, account_id)
    sms_reachable_users = CampaignDelivery.distinct(:contact_id).where(contact_id: contact_ids, status: STATUS_DELIVERED,
                                                                       account_id: account_id).pluck(:contact_id)
    { reachable_users: sms_reachable_users.count, reachability_percentage: reachability_percentage(contact_ids.size, sms_reachable_users),
      sms_reachable_users: sms_reachable_users }
  end

  def self.email_reachability(contact_ids, account_id)
    email_reachable_users = Contact.where(id: contact_ids, hard_bounce: false, spam: false, unsubscribe: false, account_id: account_id).with_emails.pluck(:id)
    { reachable_users: email_reachable_users.count, reachability_percentage: reachability_percentage(contact_ids.size, email_reachable_users),
      email_reachable_users: email_reachable_users }
  end

  def self.total_reachable_users(sms_reachable_users, email_reachable_users)
    sms_reachable_users = [] if sms_reachable_users.nil?
    email_reachable_users = [] if email_reachable_users.nil?

    (sms_reachable_users + email_reachable_users).uniq.size
  end

  def self.reachability_percentage(total_count, reachable_users)
    reachable_users_count = reachable_users.size
    rp = (reachable_users_count.to_f / total_count * DIVIDED_WITH).round(ROUNDOFF)
    rp.to_s == 'NaN' ? PERCENT_RESCUED : rp
  rescue StandardError
    PERCENT_RESCUED
  end

  def filter_revision_history
    revision_history_array = [{edited_time: updated_at.to_i, description: segment_filter&.description, version_type: CURRENT_VERSION.titleize, version_id: id }]
    versions.reverse_each do |version|
      refied_version = version.reify
      revision_history_array << { edited_time: version.created_at.to_i, description: refied_version.segment_filter&.description, version_type: nil, version_id: version.id  }
    end
    revision_history_array
  end

  def file_revision_history
    import_audience_history
    revision_history_array = [import_audience_history]
    return revision_history_array if import_file_segments.blank?

    import_file_segments.order_by_desc.each do |ifs|
      revision_history_array << { edited_time: ifs.created_at.to_i,
                                  operation: ifs.event_type&.titleize,
                                  total_users: ifs.total_users,
                                  added_users: ifs.added_users,
                                  invalid_users: ifs.invalid_users,
                                  removed_users: ifs.removed_users,
                                  status: ifs.status&.titleize,
                                  version_id: ifs&.id,
                                  version_type: INITIAL_VERSION.titleize
                                }
    end
    revision_history_array.sort_by! { |key| key[:edited_time] }.reverse
  end

  def file_reachable_users
    contact_ids = Contact.where('source_id @> ARRAY[?]', id).pluck(:id)
    sms_reachability = Segment.sms_reachability(contact_ids, Current.account.id)
    email_reachability = Segment.email_reachability(contact_ids, Current.account.id)
    @total_reachable_users = Segment.total_reachable_users(sms_reachability[:sms_reachable_users], email_reachability[:email_reachable_users])
    {
      total_users: contact_ids.size,
      reachable_users_count: @total_reachable_users,
      reachability_percentage: avarage_users_percentage(contact_ids.size),
      by_channels: {
        sms_reachability: Segment.sms_reachability(contact_ids, Current.account.id),
        email_reachability: Segment.email_reachability(contact_ids, Current.account.id),
        whatsapp_reachability: {
          reachable_users: ZERO,
          reachability_percentage: PERCENT_RESCUED
        },
        push_reachability: {
          reachable_users: ZERO,
          reachability_percentage: PERCENT_RESCUED
        }
      },
      last_refreshed_at: ZERO
    }.as_json
  end

  def description_string
    file_segment? ? description : segment_filter&.description
  end

  def file_segment?
    segment_type == 'File'
  end

  def avarage_users_percentage(total_users_count)
    aup = (@total_reachable_users.to_f / total_users_count * DIVIDED_WITH).round(ROUNDOFF)
    aup.to_s == 'NaN' ? PERCENT_RESCUED : aup
  rescue StandardError
    PERCENT_RESCUED
  end

  def segment_contact_ids
    segment_filter.segment_user_ids.pluck(:user_ids).flatten
  end

  def import_file_url
    nil unless file_segment?

    file = ImportUser.find_by(custom_segment_id: id, custom_segment: name)&.import_file&.first
    return Rails.application.routes.url_helpers.url_for(file) if ENV.fetch('ACTIVE_STORAGE_SERVICE', 'local') == 'local'

    S3::GeneratePresignedUrl.generate_presigned_url(file, 300) # expires in 5 minutes
  rescue StandardError => e
    Rails.logger.error(e.message)
    nil
  end

  def import_audience_history
    impusr = Current.account.import_users.find_by(custom_segment_id: id)
    added_users = impusr&.new_users_count.to_i + impusr&.updated_users_count.to_i
    {
      edited_time: impusr&.created_at.to_i,
      operation: ADD_USERS.titleize,
      total_users: impusr&.total_rows.to_i,
      added_users: added_users,
      invalid_users: impusr&.failed_count.to_i,
      removed_users: ZERO, status: impusr&.status&.titleize,
      version_type: INITIAL_VERSION,
      version_id: impusr&.id
    }
  end
end
