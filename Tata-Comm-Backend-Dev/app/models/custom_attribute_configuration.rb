# == Schema Information
#
# Table name: custom_attribute_configurations
#
#  id             :bigint           not null, primary key
#  data_type      :string
#  description    :text
#  displayed_name :string
#  name           :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  account_id     :integer
#
class CustomAttributeConfiguration < ApplicationRecord
end
