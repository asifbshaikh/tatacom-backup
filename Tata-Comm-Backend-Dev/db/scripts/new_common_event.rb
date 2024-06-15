events = JSON.parse(File.read('./private/user_event/common_user_event.json'))
events.each do |event|
	CommonEvent.create!(name: event["name"], displayed_name: event["displayed_name"], category: event["category"])
end