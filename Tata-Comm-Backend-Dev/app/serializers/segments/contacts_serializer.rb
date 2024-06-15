class Segments::ContactsSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :phone_number, :digo_engage_id, :first_seen, :last_seen, :no_of_sessions, :last_activity_at

  def first_seen
    object.first_seen.to_i
  end

  def last_seen
    object.last_seen.to_i
  end

  def last_activity_at
    object.last_activity_at.to_i
  end

  # override customer_id to id
  def digo_engage_id
    object.id
  end

  # override id to customer_id
  def id
    object.customer_id
  end
end