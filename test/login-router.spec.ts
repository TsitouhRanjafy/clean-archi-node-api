import {describe, expect, test} from '@jest/globals';
import { StatusCodes } from 'http-status-codes';

class LoginRouter {
    route(httpRequest: httpRequest): httpRequest {
        if (!httpRequest || !httpRequest.body){
            return {
                body: new MissingParamError('httpRequest'),
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR
            }
        }
        const { email,password } = httpRequest.body as login
        if (!email || !password){
            return {
                body: new MissingParamError('email or password'),
                statusCode: StatusCodes.BAD_REQUEST
            }
        }
        return {
            body: { email,password },
            statusCode: StatusCodes.OK
        }
    }
}


interface login {
    password: string,
    email: string
}

interface httpRequest {
    body: login | MissingParamError
    statusCode: number;
}

class MissingParamError extends Error {
    constructor(paramName: string){
        super(`Missing param: ${paramName}`);
        this.name = 'MissingParamError'
    }
}

describe('Login Router',() => {
    test(`Should return ${StatusCodes.BAD_REQUEST} if no email is provided`,() => {
        const sut = new LoginRouter()
        const httpRequest: httpRequest = {
            body: {
                password: 'any_password',
                email: ''
            },
            statusCode: 0
        } 
        const httpResponse: httpRequest = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(httpResponse.body).toEqual(new MissingParamError('email or password'))
    })

    test(`Should return ${StatusCodes.BAD_REQUEST} if no password is provided`,() => {
        const sut = new LoginRouter()
        const httpRequest: httpRequest = {
            body: {
                password: '',
                email: 'ranjafytsito@gmail.com'
            },
            statusCode: 0
        } 
        const httpResponse: httpRequest = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(httpResponse.body).toEqual(new MissingParamError('email or password'))
    })

    test(`Should return ${StatusCodes.INTERNAL_SERVER_ERROR} if no httpRequest is provided`,() => {
        const sut = new LoginRouter()
        const httpRequest: any = undefined; // eslint-disable-line 
        const httpResponse: httpRequest = sut.route(httpRequest) // eslint-disable-line 
        expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(httpResponse.body).toEqual(new MissingParamError('httpRequest'))
    })
})