class Db::DbConfigurationsSerializer < ActiveModel::Serializer
  attributes :id, :name, :adapter, :encoding, :host, :username, :password, :database, :port, :account_id, :created_at

  def host
    object.decrypted_host
  end

  def username
    object.decrypted_username
  end

  def password
    object.decrypted_password
  end

  def database
    object.decrypted_database
  end

  def created_at
    object.created_at.to_i
  end
end
