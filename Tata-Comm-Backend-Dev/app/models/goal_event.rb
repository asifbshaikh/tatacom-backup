# == Schema Information
#
# Table name: goal_events
#
#  id               :bigint           not null, primary key
#  event_name       :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  campaign_goal_id :bigint           not null
#

class GoalEvent < ApplicationRecord
  validates :event_name, allow_blank: true, uniqueness: { scope: [:campaign_goal_id], case_sensitive: false }
  belongs_to :campaign_goal
end
