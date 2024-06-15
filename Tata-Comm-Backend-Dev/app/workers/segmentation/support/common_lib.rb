class Segmentation::Support::CommonLib
  def self.find_contact(contact_attribute, account, import_user)
    find_by_atributes = if anonymous?(import_user)
                          { email: contact_attribute['email']&.downcase, phone_number: "+#{contact_attribute['phone_number']}", customer_id: nil }
                        else
                          { customer_id: contact_attribute['customer_id'] }
                        end
    account.contacts.find_by(find_by_atributes)
  end

  def self.search_contacts(data, account, import_user, segment_id)
    if anonymous?(import_user)
      searchable_data = get_values(data)
      account.contacts.where('email in (?) and phone_number in (?) AND source_id &&  ARRAY[?]::integer[]', searchable_data[:emails],
                             searchable_data[:phone_numbers], [segment_id])
    else
      batch_rows = data.map(&:to_h).map(&:first).flatten.uniq
      customer_ids = batch_rows.shift.parameterize(separator: '_')
      account.contacts.where('customer_id IN (?) AND source_id &&  ARRAY[?]::integer[]', customer_ids, [segment.id])
    end
  end

  def self.get_values(data)
    emails = []
    phone_numbers = []
    data.map(&:to_h).each do |hs|
      emails << hs['Email']
      phone_numbers << "+#{hs['Phone Number']}"
    end
    { emails: emails, phone_numbers: phone_numbers }
  end

  def self.anonymous?(import_user)
    import_user.user_type == ANONYMOUS
  end

  def self.sent_emails(import_file_segment, invalid_csv_data)
    import_file_segment.emails.each do |email|
      SendImportFileSegmentJob.perform_now(import_file_segment.id, invalid_csv_data, email)
    end
  end
end
