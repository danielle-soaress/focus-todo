module Api
    module V1
        class TasksController <ApplicationController
            before_action :set_task, only %i[show update destroy]

            def index
                @tasks = Task.all
                render json: @tasks
            end

            def show
                if @task
                    render json: {message: "Task found", data: @task}, status: :ok
                else
                    render json: {message: "Task not found", error: @task.errors}, status: :not_found
                end
            end

            def create
                task = Task.new(task_params)
                if task.save
                    render json: {message: "Task created successfully", data: task}, status: :created
                else
                    render json: {message: "Failed to create task", error: task.errors}, status: :unprocessable_entity
                end
            end

            def update
                if @task.update(task_params)
                    render json: {message: "Task updated successfully", data: @task}, status: :ok
                else
                    render json: {message: "Failed to update task", error: @task.errors}, status: :unprocessable_entity
                end
            end

            def destroy
                if @task.destroy
                    render json: {message: "Task deleted successfully"}, status: :ok
                else  
                    render json: {message: "Task not found", error: @task.errors}, status: :not_found
                end
            end

            private

            def set_task
                @task = Task.find(params[:id])
            end
        end
    end
end
