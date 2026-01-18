Rails.application.routes.draw do
  resources :tasks
  resources :categories
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # /api/v1/tasks/:id
  # /api/v1/categories/:id
  # /api/v1/users/:id

  namespace :api do
    namespace :v1 do
      resources :tasks
      resources :categories
      resources :users
    end
  end
end
