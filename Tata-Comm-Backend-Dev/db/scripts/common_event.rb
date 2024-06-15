events = JSON.parse(File.read('./private/user_event/user_event.json'))
events.each do |event|
	descr = event["description"] ? event["description"] : ""
	CommonEvent.create!(name: event["name"], displayed_name: event["displayed_name"], category: event["category"], description: descr, source: event["source"])
end
