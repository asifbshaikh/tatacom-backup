class AddCustomAttrJob < ApplicationJob
  queue_as :high

  def perform(contact_ids)
    contact_ids.each_slice(BATCH_SIZE)do |contact_id|
      contacts = Contact.where(id: contact_id).where.not("custom_attributes = '{}'").select(:id, :account_id, :updated_at, :custom_attributes)
      contacts.each do |contact|
        contact.send(:sync_custom_attributes)
      end
    end
  rescue StandardError => e
    Rails.logger.info "Exception: Adding custom attribute : #{e.message}"
  end
end
  