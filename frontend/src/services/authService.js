export const signUpApi = async (bodyObject) => {
    /* mock
    bodyObject = {
        full_name: 'exampleUser',
        email: 'user@example.com',
        password: 'senha123'
    };*/

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyObject)
    }

    try {
        const response = await fetch(`/users`, requestOptions);

        if (response.ok) {
            const result = await response.json();
            console.log('Response: ', result); 
            return [result, null]
        }
        return [null, { status: response.status,
                        message: response.error || response.errors || 'Erro desconhecido'}];
    } catch (error) {
        console.error("Erro fatal de rede:", error);
        return [null, { status: 0, message: "Sem conexão com o servidor." }];
    }
}


export const signInApi = async (bodyObject) => {
    /* mock
    bodyObject = {
        email: 'user@example.com',
        password: 'senha123'
    };*/

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyObject)
    }

    try {
        const response = await fetch(`/users/sign_in`, requestOptions);
        const authHeader = response.headers.get('Authorization');
        let data = {};

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = { error: text }; 
        }


        if (response.ok) {
            const token = authHeader ? authHeader.replace('Bearer ', '') : null;
            return [{ token: token, user: data}, null];
        }

        console.log("erro não fatal")
        return [null, { status: response.status,
                        message: response.error || response.errors || 'Erro desconhecido'}];
    } catch (error ) {
        console.error("Erro fatal de rede:", error);
        return [null, { status: 0, message: "Sem conexão com o servidor." }];
    }
}

export const signOutApi = async (bodyObject) => {
    const token = localStorage.getItem('user_token');

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyObject)
    }

    try {
        const response = await fetch(`/users/sign_out`, requestOptions);

        if (response.ok) {
            return true;
        }
        return false;
    } catch (error ) {
        console.error("Erro fatal de rede:", error);
        return [null, { status: 0, message: "Sem conexão com o servidor." }];
    }
}