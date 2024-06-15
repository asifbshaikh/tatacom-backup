json.pagination @pagination_values

json.payload do
  json.array! @inboxes do |inbox|
    json.partial! 'api/v3/accounts/inboxes/index.json.jbuilder', resource: inbox
  end
end
