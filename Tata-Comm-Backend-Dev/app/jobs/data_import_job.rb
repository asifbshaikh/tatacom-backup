# TODO: logic is written tailored to contact import since its the only import available
# let's break this logic and clean this up in future

class DataImportJob < ApplicationJob
  queue_as :high

  def perform(data_import)
    contacts = []
    # Contact.acts_as_taggable_on :labels
    data_import.update!(status: :processing)
    csv = CSV.parse(data_import.import_file.download, headers: true)
    csv.each { |row| contacts << build_contact(row.to_h.with_indifferent_access, data_import.account, data_import.label) }
    result = Contact.import contacts, on_duplicate_key_update: :all, batch_size: 1000
    data_import.update!(status: :completed, processed_records: csv.length - result.failed_instances.length, total_records: csv.length)
  end

  private

  def build_contact(params, account, label)
    # TODO: rather than doing the find or initialize individually lets fetch objects in bulk and update them in memory
    contact = init_contact(params, account)

    contact.name = params[:name] if params[:name].present?
    contact.email = params[:email] if params[:email].present?
    contact.phone_number = "+" + params[:phone_number] if params[:phone_number].present?

    # Rails.logger.info contact
    # Rails.logger.info params

    contact.add_labels(label.split(',')) if label
    contact.add_labels(params[:contact_labels].split(',')) if params[:contact_labels].present?
    contact.assign_attributes(custom_attributes: contact.custom_attributes.merge(params.except(:identifier, :email, :name, :phone_number, :contact_labels)))

    # since callbacks aren't triggered lets ensure a pubsub token
    contact.pubsub_token ||= SecureRandom.base58(24)
    contact
  end

  def get_identified_contacts(params, account)
    identifier_contact = account.contacts.find_by(identifier: params[:identifier]) if params[:identifier]
    email_contact = account.contacts.find_by(email: params[:email]) if params[:email] && !identifier_contact
    phone_contact = account.contacts.find_by(phone_number: "+" + params[:phone_number]) if params[:phone_number] && !email_contact
    [identifier_contact, email_contact, phone_contact]
  end

  def init_contact(params, account)
    identifier_contact, email_contact, phone_contact = get_identified_contacts(params, account)
    # Rails.logger.info "identifier_contact"
    # Rails.logger.info identifier_contact
    # Rails.logger.info email_contact
    # Rails.logger.info phone_contact

    # intiating the new contact / contact attributes only by ensuring the identifier or email duplication errors won't occur
    contact = identifier_contact
    contact&.email = params[:email] if params[:email].present? && email_contact.blank?
    contact ||= email_contact
    contact ||= phone_contact
    # Rails.logger.info contact
    contact ||= account.contacts.new(params.slice(:email, :identifier))
    contact
  end
end
