# == Schema Information
#
# Table name: custom_attributes
#
#  id             :bigint           not null, primary key
#  displayed_name :string
#  name           :string
#  source         :string           is an Array
#  value          :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  account_id     :integer
#  contact_id     :integer
#
class CustomAttribute < ApplicationRecord
  belongs_to :contact
end
