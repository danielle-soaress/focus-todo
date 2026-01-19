
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

        data = await response.json();


        if (response.ok) {
            const token = authHeader ? authHeader.replace('Bearer ', '') : null;
            return [{ token: token, user: data}, null];
        }
        return [null, { status: response.status,
                        message: response.error || response.errors || 'Erro desconhecido'}];
    } catch (error ) {
        console.error("Erro fatal de rede:", error);
        return [null, { status: 0, message: "Sem conexão com o servidor." }];
    }
}
