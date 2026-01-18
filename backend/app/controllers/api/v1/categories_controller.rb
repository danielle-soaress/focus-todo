module Api
    module V1
        class CategoriesController <ApplicationController
            before_action :set_category, only %i[show update destroy]

            def index
                @categories = Category.all
                render json: @categories
            end

            def show
                if @category
                    render json: {message: "Category found", data: @category}, status: :ok
                else
                    render json: {message: "Category not found", error: @category.errors}, status: :not_found
                end
            end

            def create
                category = Category.new(category_params)
                if category.save
                    render json: {message: "Category created successfully", data: category}, status: :created
                else
                    render json: {message: "Failed to create category", error: category.errors}, status: :unprocessable_entity
                end
            end

            def update
                if @category.update(category_params)
                    render json: {message: "Category updated successfully", data: @category}, status: :ok
                else
                    render json: {message: "Failed to update category", error: @category.errors}, status: :unprocessable_entity
                end
            end

            def destroy
                if @category.destroy
                    render json: {message: "Category deleted successfully"}, status: :ok
                else  
                    render json: {message: "Category not found", error: @category.errors}, status: :not_found
                end
            end

            private
            def set_category
                @category = Category.find(params[:id])
            end
        end
    end
end
