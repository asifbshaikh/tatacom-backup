# == Schema Information
#
# Table name: queue_items
#
#  id         :bigint           not null, primary key
#  contents   :text
#  pending    :boolean          default(TRUE)
#  topic      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class QueueItem < ApplicationRecord
end
