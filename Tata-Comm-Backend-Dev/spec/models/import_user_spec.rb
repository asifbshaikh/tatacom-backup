require 'rails_helper'

RSpec.describe ImportUser, type: :model do
  describe 'validations' do
    let(:import_user) { create(:import_user) }
    it { should validate_presence_of(:account_id) }
    it { should validate_presence_of(:account_user_id) }
    it { should validate_presence_of(:file_url) }
    it { should validate_presence_of(:user_type) }
  end

  describe 'associations' do
    it { should belong_to(:account) }
    it { should belong_to(:account_user) }
    it { should have_many(:contacts).dependent(:destroy_async) }
  end

  describe 'enums' do
    it { should define_enum_for(:user_type).with_values(registered: 0, anonymous: 1) }
    it { should define_enum_for(:status).with_values(created: 0, processing: 1, completed: 2, failed: 3) }
  end
end
