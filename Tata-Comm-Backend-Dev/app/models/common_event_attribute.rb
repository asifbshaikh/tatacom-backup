# == Schema Information
#
# Table name: common_event_attributes
#
#  id              :bigint           not null, primary key
#  category        :string
#  data_types      :string           default([]), is an Array
#  display_name    :string
#  name            :string
#  values          :text             default([]), is an Array
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  common_event_id :integer
#
class CommonEventAttribute < ApplicationRecord
  belongs_to :common_event
end
