class Segments::SampleContactsSerializer < ActiveModel::Serializer
  attributes :sample_user_details

  def sample_user_details
    contacts = fetch_contacts.order_by_desc.limit(SAMPLE_USER_COUNT)
    ActiveModelSerializers::SerializableResource.new(contacts, each_serializer: Segments::ContactsSerializer)
  end

  private

  def fetch_contacts
    params = @instance_options[:search_params]
    if params['search_name'] && params['search_email']
      segment_contacts.where(
        'name ILIKE ? AND email ILIKE ?', "%#{params['search_name']}%", "%#{params['search_email']}%"
      ).limit(SAMPLE_USER_COUNT)
    elsif params['search_name']
      segment_contacts.where('name ILIKE ?', "%#{params['search_name']}%")
    elsif params['search_email']
      segment_contacts.where('email ILIKE ?', "%#{params['search_email']}%")
    else
      segment_contacts
    end
  end

  def segment_contacts
    if object.instance_of?(::Segment)
      return Contact.where('source_id @> ARRAY[?]', object.id) if object.file_segment?
      contact_ids = object.segment_filter&.segment_user_ids&.first&.user_ids
    else
      contact_ids = object&.segment_user_ids&.first&.user_ids
    end
    Contact.where("id IN(?)", contact_ids) if contact_ids.present?
  end
end
