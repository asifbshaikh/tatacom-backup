class Db::DbWrapper
  def initialize(db_config, c_name)
    @adapter = db_config.adapter
    @database = db_config.decrypted_database
    @encoding = db_config.encoding
    @host = db_config.decrypted_host
    @name = c_name.parameterize.underscore
    @password = db_config.decrypted_password
    @port = db_config.port
    @username = db_config.decrypted_username
  end

  # establishing connection with db dynamically
  def establish_class_connection
    db_credentials = { adapter: @adapter,
                       database: @database,
                       encoding: @encoding,
                       pool: TEN,
                       host: @host,
                       password: @password,
                       port: @port,
                       username: @username }
    model_name = @name.singularize.camelize
    DynamicClassService.create_class(model_name, db_credentials)
    model_name
  end
end
