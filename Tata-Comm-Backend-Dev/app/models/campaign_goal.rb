# == Schema Information
#
# Table name: campaign_goals
#
#  id                      :bigint           not null, primary key
#  attribute_name          :string
#  attribute_value         :string
#  attribution_window      :integer
#  attribution_window_type :integer
#  capping_enabled         :boolean
#  frequency_capping_count :integer
#  name                    :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  account_id              :bigint           not null
#  campaign_id             :bigint           not null
#

class CampaignGoal < ApplicationRecord

  validates :name, presence: true
  belongs_to :account
  belongs_to :campaign
	has_many :goal_events
  accepts_nested_attributes_for :goal_events
  enum attribution_window_type: { hours: 0, day: 1 }

  def create_goal_events(event_params)
    event_params.each do |event|
      self.goal_events.create!(event_name: event)
    end
  end
end
