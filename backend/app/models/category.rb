class Category < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :color, presence: true
  validates :user_id, presence: true
end
