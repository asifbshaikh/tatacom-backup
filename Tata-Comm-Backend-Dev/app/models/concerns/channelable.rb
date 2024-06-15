module Channelable
  extend ActiveSupport::Concern
  included do
    validates :account_id, presence: true
    belongs_to :account
    has_one :inbox, as: :channel
    has_one :fc_dnd_setting, dependent: :destroy_async, :foreign_key => "channel_id"
    before_destroy :delete_fc_dnd_settings
    after_create :set_default_fc_dnd_setting
    has_many :campaigns, as: :channel

    def check_running_campaigns
      raise "Channel cannot be deleted as it is associated with running campaigns" if campaigns.running_campaigns.present?
    end

    def set_default_fc_dnd_setting
      build_fc_dnd_setting(account_id: account_id)
      save!
    end

    def delete_fc_dnd_settings
      fc_dnd_setting&.destroy
    end
  end

  def has_24_hour_messaging_window?
    false
  end
end
