require 'rails_helper'

RSpec.describe CampaignGoal, type: :model do
  describe '#create_goal_events' do
    it 'creates goal events' do
      campaign_goal = create(:campaign_goal)
      event_params = ['Event 1', 'Event 2']
      campaign_goal.create_goal_events(event_params)
      expect(campaign_goal.goal_events.count).to eq(2)
    end
  end
end
