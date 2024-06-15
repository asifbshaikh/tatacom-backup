Channel::Email.all.each do |email_channel|
    email_channel.update(channel_name: email_channel.smtp_address)
end

Channel::TataSmsc.all.each do |tatasmsc_channel|
    tatasmsc_channel.update(channel_name: tatasmsc_channel.sender_id)
end

Channel::Whatsapp.all.each do |whatsapp_channel|
    if whatsapp_channel.inbox.present?
        whatsapp_channel.update(channel_name: whatsapp_channel.inbox.name)
    end
end