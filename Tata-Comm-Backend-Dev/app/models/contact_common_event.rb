# == Schema Information
#
# Table name: contact_common_events
#
#  id               :bigint           not null, primary key
#  app_version      :string
#  campaign_channel :string
#  campaign_name    :string
#  campaign_type    :string
#  platform         :string
#  sdk_version      :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  account_id       :integer
#  campaign_id      :string
#  common_event_id  :integer
#  contact_id       :integer
#  message_id       :string
#  unique_user_id   :string
#
# Indexes
#
#  index_contact_common_events_on_campaign_channel  (campaign_channel)
#  index_contact_common_events_on_campaign_id       (campaign_id)
#  index_contact_common_events_on_campaign_name     (campaign_name)
#  index_contact_common_events_on_campaign_type     (campaign_type)
#  index_contact_common_events_on_common_event_id   (common_event_id)
#  index_contact_common_events_on_contact_id        (contact_id)
#  index_contact_common_events_on_created_at        (created_at)
#
class ContactCommonEvent < ApplicationRecord
    self.table_name = :contact_common_events
    belongs_to :contact, optional: :true
    belongs_to :common_event
    belongs_to :account, optional: :true
    belongs_to :contact_device_detail, foreign_key: 'unique_user_id', primary_key: 'unique_user_id', optional: true
    validates_uniqueness_of :message_id, scope: :common_event_id, allow_blank: true

    after_commit :create_queue_item, on: :create, unless: -> {campaign_type == EVENT_TRIGGER || contact_id.blank? }

    def create_queue_item
      campaign = Campaign.find_by(id: self.campaign_id.to_i)
      return if campaign.failed? || campaign.cancelled?

      contents = {}
      contents[:campaign_ids] = contact_event_filters_campaign_ids
      contents[:contact_id] = contact_id
      event_name = common_event.name.camelize.downcase
      QueueItem.create!(contents: contents.to_json, topic: "#{campaign_channel}_#{event_name}_#{id}") if contents[:campaign_ids].present?
    end

    private

    def contact_event_filters_campaign_ids
      event_trigger_campaign_ids = []
      contact_event_filters = contact_event_filters_for_event

      if contact_event_filters.present?
        contact_event_filters.each do |contact_event_filter|
          filter_hash = JSON.parse(contact_event_filter["filter_hash"])
          filter_hash["included_filters"]["filters"].each do |nested_filter|
            nested_filter["filters"].each do |filter|
              next unless filter['name'].downcase == common_event.name.downcase

              filter['attributes']['filters'].each do |attribute_filter|
                if attribute_filter['value'].present?
                  @event_flag = true

                  case attribute_filter['name'].downcase
                  when 'campaign_id'
                    @event_flag = false unless operator_based_comparison(self.campaign_id.to_i, attribute_filter['value'], attribute_filter['operator'])
                  when 'campaign_name'
                    @event_flag = false unless operator_based_comparison(self.campaign_name, attribute_filter['value'], attribute_filter['operator'])
                  when 'campaign_channel'
                    @event_flag = false unless operator_based_comparison(self.campaign_channel, attribute_filter['value'], attribute_filter['operator'])
                  when 'campaign_type'
                    @event_flag = false unless operator_based_comparison(self.campaign_type, attribute_filter['value'], attribute_filter['operator'])
                  end
                end
              end
            end
          end
          event_trigger_campaign_ids << contact_event_filter['campaign_id'] if @event_flag
        end
      end
      event_trigger_campaign_ids
    end

    def contact_event_filters_for_event
      query = <<~SQL
        SELECT *
        FROM contact_event_filters,
          jsonb_array_elements(filter_hash->'included_filters'->'filters') AS filters,
          jsonb_array_elements(filters->'filters') AS filter
        WHERE lower(filter->>'name') = '#{common_event.name.downcase}' AND account_id = '#{contact.account_id}';
      SQL

      ActiveRecord::Base.connection.execute(query)
    end

    def operator_based_comparison(value1, value2, operator)
      case operator
      when 'is'
        value1 == value2
      when 'exists'
        value1.split(',').include?(value2)
      when 'contains'
        value1.include?(value2)
      when 'starts_with'
        value1.start_with?(value2)
      when 'ends_with'
        value1.start_with?(value2)
      when 'is_not'
        value1 != value2
      when 'does_not_exist'
        !value1.split(',').include?(value2)
      when 'does_not_contain'
        !value1.include?(value2)
      when 'does_not_start_with'
        !value1.start_with?(value2)
      when 'does_not_end_with'
        !value1.end_with?(value2)
      when 'in_the_following'
        value1.split(',').include?(value2)
      when 'not_in_the_following'
        !value1.split(',').include?(value2)
      end
    end

end
