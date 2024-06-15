class AddExcludeUsersAndAudienceTypeInFilterSegments < ActiveRecord::Migration[6.1]
  def change
    add_column :segment_filters, :audience_type, :string
    add_column :segment_filters, :exclude_users, :boolean, default: false
  end
end
