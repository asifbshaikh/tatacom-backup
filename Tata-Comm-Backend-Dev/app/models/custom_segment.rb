# == Schema Information
#
# Table name: custom_segments
#
#  id             :bigint           not null, primary key
#  description    :text
#  file_url       :text
#  name           :string
#  segment_source :string
#  source_type    :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  account_id     :bigint           not null
#
class CustomSegment < ApplicationRecord
  belongs_to :account
end