# == Schema Information
#
# Table name: group_tags
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class GroupTag < ApplicationRecord
  has_many :campaign_tags, dependent: :destroy
  has_many :campaigns, through: :campaign_tags
end
