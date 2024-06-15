require 'rails_helper'

RSpec.describe SegmentFilter, type: :model do
  let(:account) { create(:account) }
  let(:admin) { create(:user, account: account, role: :administrator, email: "test@gmail.com") }

  context 'associations' do
    it { is_expected.to belong_to(:account) }
    it { is_expected.to have_many(:segment_user_ids)}
  end

  context 'get filtered' do
    it 'segment ids' do
      segment_filter = account.segment_filters.create
      expect(segment_filter.filter_contact_ids).to eq(segment_filter.segment_user_ids.pluck(:user_ids).flatten)
      segment_filter.avarage_users_percentage
    end
  end

  context 'get reachable' do
    it 'users data' do
      segment_filter = account.segment_filters.create
      reachable_users = segment_filter.reachable_users
      expect(reachable_users["total_users"]).to eql (segment_filter.users_count)
      expect(reachable_users["reachable_users_count"]).to eql (segment_filter.avarage_users_count)
      expect(reachable_users["by_channels"]["email_reachability"]).to eql (segment_filter.email_reachability)
      expect(reachable_users["by_channels"]["whatsapp_reachability"]["reachable_users"]).to eql ZERO
      expect(reachable_users["by_channels"]["whatsapp_reachability"]["reachability_percentage"]).to eql PERCENT_RESCUED
      expect(reachable_users["by_channels"]["push_reachability"]["reachable_users"]).to eql ZERO
      expect(reachable_users["by_channels"]["push_reachability"]["reachability_percentage"]).to eql PERCENT_RESCUED
      expect(reachable_users["last_refreshed_at"]).to eql (segment_filter.last_refreshed_at.to_i)
    end
  end
end