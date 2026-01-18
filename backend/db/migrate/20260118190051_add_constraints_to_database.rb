class AddConstraintsToDatabase < ActiveRecord::Migration[8.1]
  def up
    add_index :categories, [:user_id, :name], unique: true
    change_column :categories, :color, :string, limit: 6
    change_column :categories, :name, :string, limit: 30
    change_column :users, :full_name, :string, limit: 100
  end
  def down
    remove_index :categories, [:user_id, :name]
    change_column :categories, :color, :string, limit: nil
    change_column :categories, :name, :string, limit: nil
    change_column :users, :full_name, :string, limit: nil
  end
end
