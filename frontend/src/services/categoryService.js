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

export const createCategory = async (bodyObject) => {
    /* mock 
        {
           "category": {
               "name": "Faculdade",
               "color": "FF0000"
           }
       }
    */

    const token = localStorage.getItem('user_token');

    const requestOptions = requestJson(bodyObject, token, "POST");

    try {
        const response = await fetch(`/categories`, requestOptions);

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

export const deleteCategory = async (categoryId) => {
    const token = localStorage.getItem('user_token');
    const requestOptions = requestJson(null, token, "DELETE");

    try {
        const response = await fetch(`/categories/${categoryId}`, requestOptions);

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

export const updateCategory = async (categoryId, body) => {
    /* mock 
        {
           "category": {
               "name": "Faculdade",
               "color": "FF0000"
           }
       }
    */

    const token = localStorage.getItem('user_token');
    const requestOptions = requestJson(body, token, "PATCH");

    try {
        const response = await fetch(`/categories/${categoryId}`, requestOptions);

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

export const getCategory = async (categoryId) => {
    const token = localStorage.getItem('user_token');
    const requestOptions = requestJson("", token, "GET");

    try {
        const response = await fetch(`/categories/${categoryId}`, requestOptions);

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

export const getAllCategories = async () => {
    const token = localStorage.getItem('user_token');
    const requestOptions = requestJson("", token, "GET");

    try {
        const response = await fetch(`/categories`, requestOptions);

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