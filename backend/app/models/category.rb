class Category < ApplicationRecord
  belongs_to :user

  validates :name, presence: true, length: {minimium: 3, maximum: 30}, uniqueness: {scope: :user_id, case_sensitive: false, message: "It already exists."}
  validates :color, presence: true,
                    length: {is:6, message: "It must have exactly 6 characters"}, 
                    format: {
                            with: /\A[0-9A-Fa-f]{6}\z/, 
                            message: "It must have valid values (0-9, A-F)."
                            }
  validates :user_id, presence: true
end
