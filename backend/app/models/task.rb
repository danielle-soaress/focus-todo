class Task < ApplicationRecord
  belongs_to :user
  belongs_to :category

  validates :title, presence: true, length: {minimum: 4, maximum: 100}
  validates :description, presence: true, length: {maximum: 300}
  validates :status, inclusion: { in: [true, false] }
  validates :due_date, presence: true
  validates :priority, inclusion: { in: [0, 1, 2] } # 0: low, 1: medium, 2: high
  validates :user, presence: true
  validates :category, presence: true
end
