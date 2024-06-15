class AddPolymorphicRelationToCampaign < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :campaignable_id, :bigint
    add_column :campaigns, :campaignable_type, :string
  end
end
