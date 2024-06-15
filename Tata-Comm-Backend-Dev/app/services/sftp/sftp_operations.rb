module Sftp::SftpOperations

  def disconnect
    @sftp_connection.close_channel
    ssh_session.close
  end

  def upload_file(local_path, remote_path)
   @sftp_connection.upload!(local_path, remote_path)
    puts "Uploaded #{local_path}"
  end

  def download_file(remote_path, import_type, date_format)
    local_path = Rails.root.join('tmp')
    file_lists = list_files(remote_path, import_type, date_format)
    file_lists.each do |file_name|
      @sftp_connection.download!("#{remote_path}/#{file_name[:name]}", "#{local_path}/#{file_name[:name]}")
    end
    { message: "Downloaded successfully from #{remote_path} to #{local_path}" }
  rescue Net::SFTP::StatusException => e
    message("Error downloading #{remote_path} => #{e.message}")
  rescue StandardError => e
    message("Error downloading #{remote_path} => #{e.message}")
  end

  def list_files(remote_path, import_type, date_format)
    file_lists = []
    files = @sftp_connection.dir.glob(remote_path, "**/*#{import_type}#{USER_DATA}#{date_format}.csv")
    # files = @sftp_connection.dir.entries(remote_path)
    files.each do |entry|
      file_lists << {
                      name: entry.name,
                      size: entry.attributes.attributes[:size],
                      accessed_time: entry.attributes.attributes[:atime],
                      modified_time: entry.attributes.attributes[:mtime]
                    }
    end
    file_lists
  rescue Net::SFTP::StatusException => e
    message("Error listing #{remote_path} => #{e.message}")
  rescue StandardError => e
    message("Error listing #{remote_path} => #{e.message}")
  end

  def view_first_file_with_five_lines(remote_path, import_type, date_format)
    file_name = list_files(remote_path, import_type, date_format).pluck(:name).first
    return message("No file found") unless file_name
    fetch_path = "#{remote_path}/#{file_name}"
    data = @sftp_connection.download!(fetch_path)
    csv = CSV.new(data, :headers => true, :header_converters => :symbol, :converters => :all)
    data = csv.to_a.map {|row| row.to_hash }
    data.first(5)
  rescue Net::SFTP::StatusException => e
    message("Error validating #{fetch_path} => #{e.message}")
  rescue StandardError => e
    message("Error validating #{fetch_path} => #{e.message}")
  end

  def message(message)
    Rails.logger.error(message)
    { message: message }
  end
end