# == Schema Information
#
# Table name: custom_attribute_definitions
#
#  id                     :bigint           not null, primary key
#  attribute_description  :text
#  attribute_display_name :string
#  attribute_display_type :integer          default("text")
#  attribute_key          :string
#  attribute_model        :integer          default("conversation_attribute")
#  attribute_values       :jsonb
#  default_value          :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  account_id             :bigint
#
# Indexes
#
#  attribute_key_model_index                         (attribute_key,attribute_model) UNIQUE
#  index_custom_attribute_definitions_on_account_id  (account_id)
#
class CustomAttributeDefinition < ApplicationRecord
  scope :with_attribute_model, ->(attribute_model) { attribute_model.presence && where(attribute_model: attribute_model) }
  validates :attribute_display_name, presence: true

  validates :attribute_key,
            presence: true,
            uniqueness: { scope: [:account_id, :attribute_model] }

  validates :attribute_display_type, presence: true
  validates :attribute_model, presence: true

  validate :check_existing_column

  enum attribute_model: { conversation_attribute: 0, contact_attribute: 1 }
  enum attribute_display_type: { text: 0, number: 1, currency: 2, percent: 3, link: 4, date: 5, list: 6, checkbox: 7 }

  belongs_to :account


  def check_existing_column
    errors.add('column', 'already exists in Contacts Table') if contact_model? && Contact.column_names.include?(attribute_key)
  end

  def contact_model?
    attribute_model.to_sym == :contact_attribute
  end

  def conversation_model?
    attribute_model.to_sym == :conversation_attribute
  end

end
