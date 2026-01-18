class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.boolean :status, default: false, null: false
      t.datetime :due_date, null: false
      t.integer :priority, null: 0 # 0: low, 1: medium, 2: high
      t.references :user, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
