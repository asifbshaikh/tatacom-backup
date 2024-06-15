class DbRecordInsertionJob
  include Sidekiq::Worker
  queue_as :high

  def perform(db_schedule_id, d_s_import_id, s3_file_key)
    db_schedule = DbScheduleDetail.find(db_schedule_id)
    d_s_import = DataSyncImport.find(d_s_import_id)
    @account = d_s_import.account
    obj = S3::S3Service.fetch_aws_object(s3_file_key)
    file_url = obj.presigned_url(:get)
    @custom_attr_contacts = []
    @failed_error = []
    @failed_events = []

    csv = URI.parse(file_url).open { |f| CSV.parse(f, headers: true) }
    d_s_import.update(total_rows: csv.size)
    @processed_row = 0
    csv.each_slice(BATCH_SIZE) do |batch|
      batch.each do |row|
        create_record(db_schedule, d_s_import, row)
      end
    end
    if @failed_events.present?
      attachment_data = generate_failed_events_csv
      d_s_import.update(processed_rows: @processed_row, status: THREE, failed_error: @failed_error.first)
      db_schedule.update(status: FOUR) if db_schedule.asap? || db_schedule.at_specific_time?
      DbRecordInsertionJob.trigger_notification_mail(db_schedule, false, attachment_data, @failed_error)
    else
      d_s_import.update(processed_rows: @processed_row, status: TWO)
      db_schedule.update(status: TWO) if db_schedule.asap? || db_schedule.at_specific_time?
      DbRecordInsertionJob.trigger_notification_mail(db_schedule, true, nil, nil)
    end
    AddCustomAttrJob.perform_later(@custom_attr_contacts) if @custom_attr_contacts.present?
  rescue StandardError => e
    d_s_import.update(status: THREE, processed_rows: @processed_row, failed_error: e.message)
    db_schedule.update(status: FOUR) if db_schedule.asap? || db_schedule.at_specific_time?
    DbRecordInsertionJob.trigger_notification_mail(db_schedule, false, nil, @failed_error)
    Rails.logger.error "Failed in DbRecordInsertionJob perform at #{Time.zone.now} with errror: #{e}"
  end

  def create_record(db_schedule, d_s_import, row)
    if db_schedule.segment_name.present?
      @custom_segment = @account.segments.create!(segment_type: FILE, name: db_schedule.segment_name, source_type: IMPORT_AUDIENCE)
    end
    n_row = row.to_h
    n_row.delete('id')
    n_row.delete('created_at')
    n_row.delete('updated_at')
    if db_schedule.import_type == REGISTERED_AUDIENCE
      contact = @account.contacts.find_by(customer_id: n_row['customer_id'])
      if contact.present?
        update_contact(contact,
                       n_row)
      else
        create_contact(n_row.to_h.merge!(data_sync_import_id: d_s_import.id))
      end

    elsif db_schedule.import_type == ANONYMOUS_AUDIENCE
      email = n_row['email'].downcase
      phone_number = n_row['phone_number']
      identifier_value = "#{email}_#{phone_number}"
      contact = @account.contacts.find_by(email: email, phone_number: phone_number)
      if contact.present?
        update_contact(contact,
                       n_row)
      else
        create_contact(n_row.to_h.merge!(identifier: identifier_value, data_sync_import_id: d_s_import.id))
      end
    else
      event = CommonEvent.find_by(name: n_row['name'], displayed_name: n_row['displayed_name'], account_id: @account.id)
      event.present? ? update_event(event, n_row) : create_event(n_row)
    end
  end

  def update_contact(contact, n_row)
    if @custom_segment.present?
      contact_source_id = create_contact_source_id(contact)
      n_row.to_h.merge!(source_id: contact_source_id, creation_source: @custom_segment.name)
    end
    if n_row.to_h['custom_attributes'].present?
      n_row['custom_attributes'] = JSON.parse(n_row.to_h['custom_attributes']&.gsub('=>', ':'))
      n_row['custom_attributes'] = process_custom_attr(n_row['custom_attributes'])
    end
    contact.custom_attributes = n_row['custom_attributes']
    @custom_attr_contacts << contact.id if contact.changes['custom_attributes'].present?
    contact.update(n_row.to_h)

    @processed_row += 1
  end

  def create_contact(n_row)
    n_row.to_h.merge!(source_id: [@custom_segment.id], creation_source: @custom_segment.name) if @custom_segment.present?
    if n_row.to_h['custom_attributes'].present?
      n_row['custom_attributes'] = JSON.parse(n_row.to_h['custom_attributes']&.gsub('=>', ':'))
      n_row['custom_attributes'] = process_custom_attr(n_row['custom_attributes'])
    end
    contact = @account.contacts.create(n_row.to_h)
    @custom_attr_contacts << contact.id
    @processed_row += 1
  end

  def create_event(row)
    contact = fetch_contact(row)
    if contact.present?
      event = CommonEvent.create(name: row['name'], displayed_name: row['displayed_name'], source: DB_IMPORT, description: row['description'],
                               category: row['category'], account_id: @account.id)
      create_contact_event_and_attr(event, row, contact)
      @processed_row += 1
    else
      row['error'] = 'Could not find any contact with given customer id or email-phone combination'
      @failed_error << row['error']
      @failed_events << row
    end
  end

  def update_event(event, row)
    contact = fetch_contact(row)
    if contact.present?
      create_contact_event_and_attr(event, row, contact)
      @processed_row += 1
    else
      row['error'] = 'Could not find any contact with given customer id or email-phone combination'
      @failed_error << row['error']
      @failed_events << row
    end
  end

  def fetch_contact(row)
    if row['customer_id'].present?
      @account.contacts.find_by(customer_id: row['customer_id'])
    else
      @account.contacts.find_by(email: row['email'], phone_number: row['phone_number'])
    end
  end

  def create_contact_event_and_attr(event, row, contact)
    ContactCommonEvent.create(contact_id: contact.id, common_event_id: event.id)
    create_event_attribute(row, event) if row['event_attribute'].present?
  end

  def create_event_attribute(row, event)
    event_attr = event.common_event_attributes.find_by(name: row['event_attribute'].downcase.split.join('_'), display_name: row['event_attribute'])
    if event_attr.present?
      event_attr.update(values: event_attr.values.to_a << row['event_attribute_value'])
    else
      event.common_event_attributes.create(name: row['event_attribute'].downcase.split.join('_'), display_name: row['event_attribute'],
                                           values: [row['event_attribute_value']], category: 'Event Attributes')
    end
  end

  def create_contact_source_id(contact)
    contact.source_id.is_a?(Array) ? contact.source_id << @custom_segment.id : contact.source_id.to_a << @custom_segment.id
  end

  def self.trigger_notification_mail(db_schedule, status, attachment_data, failed_error)
    db_schedule.email_ids.each do |email_id|
      Db::DbImportNotificationMailJob.perform_now(email_id, db_schedule.id, status, attachment_data, failed_error)
    end
  end

  def process_custom_attr(attr_array)
    contact_custom_attr = {}
    attr_array.each do |attr|
      record = @account.custom_attribute_definitions.where(attribute_key: attr['key'], attribute_model: 'contact_attribute',
                                                           attribute_display_type: COL_TYPES[attr['type']])
      if record.blank?
        @account.custom_attribute_definitions.create(attribute_key: attr['key'], attribute_model: 'contact_attribute',
                                                     attribute_display_type: COL_TYPES[attr['type']], attribute_display_name: attr['key'].humanize.capitalize)
      end
      contact_custom_attr[attr['key']] = attr['value']
    end
    contact_custom_attr
  end

  def generate_failed_events_csv
    return if @failed_events.blank?
    csv_data = CSV.generate(headers: true) do |csv|
      csv << @failed_events.first.keys
      @failed_events.each do |row|
        csv << row.values
      end
    end
  end
end
