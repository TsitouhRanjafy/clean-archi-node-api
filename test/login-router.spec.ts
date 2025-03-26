import {describe, expect, test} from '@jest/globals';
class LoginRouter {
    route(httpRequest: httpRequest): httpRequest {
        const body: login = httpRequest.body
        if (!body.email || !body.password){
            return {
                body: body,
                statusCode: 400
            }
        }
        return {
            body: body,
            statusCode: 200
        }
    }
}


interface login {
    password: string,
    email: string
}

interface httpRequest {
    body: login
    statusCode: number;
}

describe('Login Router',() => {
    test('Should return 400 if no email is provided',() => {
        const sut = new LoginRouter()
        const httpRequest: httpRequest = {
            body: {
                password: 'any_password',
                email: ''
            },
            statusCode: 0
        } 
        const httpResponse: httpRequest = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
    })

    test('Should return 400 if no password is provided',() => {
        const sut = new LoginRouter()
        const httpRequest: httpRequest = {
            body: {
                password: '',
                email: 'ranjafytsito@gmail.com'
            },
            statusCode: 0
        } 
        const httpResponse: httpRequest = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
    })
})