class DynamicClassService
  # creating dynamic class at runtime
  def self.create_class(name, connection_name)
    Object.const_set(name, Class.new(ApplicationRecord) {})
    name.constantize.establish_connection(connection_name)
  end

  # removing database connection
  def self.remove_connection_and_class(name)
    name.constantize.remove_connection
    Object.class_eval { remove_const name }
  end
end
