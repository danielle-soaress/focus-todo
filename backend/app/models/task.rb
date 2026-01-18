class Task < ApplicationRecord
  belongs_to :user
  belongs_to :category

  validates :title, presence: true
  validates :description, presence: true
  validates :status, inclusion: { in: [true, false] }
  validates :due_date, presence: true
  validates :priority, inclusion: { in: [0, 1, 2] } # 0: low, 1: medium, 2: high
  validates :user, presence: true
  validates :category, presence: true

end
