import {describe, expect, test} from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import { LoginRouter } from '../src/interfaces/routes/login.router';
import { MissingParamError } from '../src/interfaces/helpers/missing-param.error';
import { httpRequest, login } from '../src/core/entities/http';


export class AuthUseCase {
    email!: string;
    password!: string;
    
    auth(email: string,password: string) {
        this.email = email;
        this.password = password;
    }
}

// SUT = System Under Test (systéme sous test)
// Spy = espion 
const makeSut = () => { 
    const authUseCaseSpy = new AuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy);
    return {
        sut, 
        authUseCaseSpy
    }
}

describe('Login Router',() => {
    test(`Should return ${StatusCodes.BAD_REQUEST} if no email is provided`,() => {
        const { sut } = makeSut()
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
        const { sut } = makeSut()
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

    test(`Should return ${StatusCodes.INTERNAL_SERVER_ERROR} if no httpRequest is provided or httpRequest has no body`,() => {
        const { sut } = makeSut()
        const httpRequest: any = undefined; // eslint-disable-line 
        const httpResponse: httpRequest = sut.route(httpRequest) // eslint-disable-line 
        expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(httpResponse.body).toEqual(new MissingParamError('httpRequest'))
    })

    test(`Should call AuthUseCase with correct params`,() => {
        const { sut, authUseCaseSpy } = makeSut()
        const httpRequest: httpRequest = {
            body: {
                email: "any_email@gmail.com",
                password: "any_password"
            },
            statusCode: 0
        }
        const body: login = httpRequest.body as login
        sut.route(httpRequest)
        expect(authUseCaseSpy.email).toBe(body.email)
        expect(authUseCaseSpy.password).toBe(body.password)
    })
})