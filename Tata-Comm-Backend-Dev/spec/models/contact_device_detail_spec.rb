require 'rails_helper'

RSpec.describe ContactDeviceDetail, type: :model do
  describe 'associations' do
    it {should belong_to(:contact)}
    it {should belong_to(:device)}
  end

  describe 'validations' do
    it {should validate_presence_of(:contact_id)}
    it {should validate_presence_of(:device_id)}
    it 'validates location structure' do
      record = build(:contact_device_detail, location: {"latitude" => 12.345, "longitude" => 67.890 })
      record.valid?
      expect(record.errors[:location]).to be_empty
      record.location = {"latitude" => 12.345}
      record.valid?
      expect(record.errors[:location]).to include('must contain latitude and longitude keys')
    end
  end
end