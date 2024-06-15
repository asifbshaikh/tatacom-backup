namespace :db_update_task do
  desc 'build combined swagger.json file from all the fragmented definitions and paths inside swagger folder'
  task remove_duplicate_contacts: :environment do
    uniq_contacts = Contact.all.distinct.pluck(:customer_id)
    uniq_contacts.each do |i|
      contact = Contact.where(customer_id: i).first
      puts "*********************** Removing duplicate contacts ****************"
      contacts_to_be_deleted = Contact.where('id NOT in (?) AND customer_id in (?)', contact.id, i)
      CampaignDelivery.where(contact_id: contacts_to_be_deleted.map(&:id)).delete_all
      contacts_to_be_deleted.destroy_all
    end
  end
end