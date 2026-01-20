const requestJson = (body, token, method) => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    return options;
}

export const createTask = async (bodyObject) => {
    /* mock  (category id = 5 precisa existir)
        {
            "task": {
                "title": "Estudar React Router",
                "description": "Ler a documentação oficial e fazer testes.",
                "due_date": "2026-01-20",
                "priority": 2,
                "status": false,
                "category_id": 5
            }
        }
    */

    const token = localStorage.getItem('user_token');

    const requestOptions = requestJson(bodyObject, token, "POST");

    try {
        const response = await fetch(`/tasks`, requestOptions);

        let data = {};
        try {
            data = await response.json();
        } catch (e) {
            console.warn("Servidor não retornou JSON na criação");
        }

        if (response.ok) {
            return [data, null];
        }
        return [null, { status: response.status, 
                        message: data.error || data.errors || 'Não foi possível criar a tarefa.' 
                      }];
    } catch (error ) {
        // console.error("Erro fatal de rede:", error);
        return [null, { status: 0, message: "Sem conexão com o servidor." }];
    }
}

export const deleteTask = async (taskId) => {
    const token = localStorage.getItem('user_token');
    const requestOptions = requestJson(null, token, "DELETE");

    try {
        const response = await fetch(`/tasks/${taskId}`, requestOptions);

        if (response.ok) {
            return [true, null];
        }

        let data = {};
        try { data = await response.json(); } catch(e) {}

        return [false, { 
            status: response.status, 
            message: data.error || 'Erro ao deletar.' 
        }];
    } catch (error) {
        return [false, { status: 0, message: "Sem conexão." }];
    }
}

export const updateTask = async (taskId, body) => {
    /* mock  (category id = 5 precisa existir)
        {
            "task": {
                "title": "Estudar",
                "description": "Ler a documentação oficial",
                "due_date": "2026-01-19",
                "priority": 0,
                "status": false,
                "category_id": 2
            }
        }
    */

    const token = localStorage.getItem('user_token');
    const requestOptions = requestJson(body, token, "PATCH");

    try {
        const response = await fetch(`/tasks/${taskId}`, requestOptions);

        let data = {};

        try {
            data = await response.json();
        } catch (e) {}

        if (response.ok) {
            return [data, null];
        }

        return [null, { 
            status: response.status, 
            message: data.error || 'Erro ao atualizar.' 
        }];
    } catch (error) {
        // console.error("Erro fatal de rede:", error);
        return [null, { status: 0, message: "Sem conexão com o servidor." }];
    }
}

export const getTask = async (taskId) => {
    const token = localStorage.getItem('user_token');
    const requestOptions = requestJson(null, token, "GET");

    try {
        const response = await fetch(`/tasks/${taskId}`, requestOptions);

        let data = {};
        try {
            data = await response.json();
        } catch (e) {}

        if (response.ok) {
            return [data, null];
        }
        return [null, { 
            status: response.status, 
            message: data.error || 'Erro ao buscar tarefa.' 
        }];
    } catch (error) {
        // console.error("Erro fatal de rede:", error);
        return [null, { status: 0, message: "Sem conexão com o servidor." }];
    }
}

export const getAllTasks = async () => {
    const token = localStorage.getItem('user_token');
    const requestOptions = requestJson(null, token, "GET");

    try {
        const response = await fetch(`/tasks`, requestOptions);

        let data = [];
        try {
            data = await response.json();
        } catch (e) {}

        if (response.ok) {
            return [data, null];
        }
        return [null, { 
            status: response.status, 
            message: 'Erro ao carregar tarefas.' 
        }];
    } catch (error) {
        // console.error("Erro fatal de rede:", error);
        return [null, { status: 0, message: "Sem conexão com o servidor." }];
    }
}