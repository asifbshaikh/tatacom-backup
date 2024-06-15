json.array! @countries do |country|
  json.name country[0]
  json.phone_code country[1]
  json.country_code country[2]
end
