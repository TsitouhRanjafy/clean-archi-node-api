import {describe, expect, test} from '@jest/globals';
class LoginRouter {
    route(httpRequest: httpRequest): httpRequest {
        if (!httpRequest){
            return {
                body: { email: '',password:''},
                statusCode: 400
            }
        }
        const { email,password } = httpRequest.body
        if (!email || !password){
            return {
                body: { email,password },
                statusCode: 400
            }
        }
        return {
            body: { email,password },
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


    test('Should return 400 if no httpRequest is provided',() => {
        const sut = new LoginRouter()
        const httpRequest: any = undefined; // eslint-disable-line 
        const httpResponse: httpRequest = sut.route(httpRequest) // eslint-disable-line 
        expect(httpResponse.statusCode).toBe(400)
    })
})