# == Schema Information
#
# Table name: channel_types
#
#  id         :bigint           not null, primary key
#  class_name :string
#  name       :string
#  provider   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ChannelType < ApplicationRecord
  validates_presence_of :name, :class_name, :provider
end
