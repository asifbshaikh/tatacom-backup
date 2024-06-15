# == Schema Information
#
# Table name: email_templates
#
#  id            :bigint           not null, primary key
#  body          :text             not null
#  design        :jsonb
#  locale        :integer          default("en"), not null
#  name          :string           not null
#  template_type :integer          default("content")
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  account_id    :integer
#
# Indexes
#
#  index_email_templates_on_name_and_account_id  (name,account_id) UNIQUE
#
class EmailTemplate < ApplicationRecord
  enum locale: LANGUAGES_CONFIG.map { |key, val| [val[:iso_639_1_code], key] }.to_h
  enum template_type: { layout: 0, content: 1 }
  belongs_to :account, optional: true

  validates :name, uniqueness: { scope: :account }
  validates :body, :name, :design, presence: true

  before_destroy :check_running_campaigns


  def self.resolver(options = {})
    ::EmailTemplates::DbResolverService.using self, options
  end

  def self.get_email_template(template)
    # To check if template available in current account or its a predefined template
    email_template = Current.account.email_templates.find(template) || EmailTemplate.find_by(id: template, account_id: 1)
  end

  def check_running_campaigns
    raise "Template cannot be deleted as it is associated with campaigns" if Campaign::EmailCampaign.exists?(email_template_id: id)
  end
end
