class Api::V3::Accounts::GlobalControlGroupSerializer < ActiveModel::Serializer
  attributes :id, :control_group, :random_allocation_percentage, :apply_global, :allow_marketers, :active
  has_one :account
end
