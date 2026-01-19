
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
            return [result, '']
        }
        return ['', 'Server side error']
    } catch (error ) {
        console.log('Error: ', error);
        return ['', `Server down: ${error}`]
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

        if (response.ok) {
            const result = await response.json();
            console.log('Response: ', result); 
            return [result, '']
        }
        return ['', 'Server side error']
    } catch (error ) {
        console.log('Error: ', error);
        return ['', `Server down: ${error}`]
    }
}
