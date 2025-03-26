import {describe, expect, test} from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import { LoginRouter } from '../src/interfaces/routes/login.router';
import { MissingParamError } from '../src/interfaces/helpers/missing-param.error';
import { httpRequest, login } from '../src/core/entities/http';
import { UnauthorizedError } from '../src/interfaces/helpers/unauthorized.error';
import { ServerError } from '../src/interfaces/helpers/server.error';


export class AuthUseCaseSpy {
    email!: string;
    password!: string;
    accesToken!:string | null;
    
    auth(email: string,password: string): string | null {
        this.email = email;
        this.password = password;
        return this.accesToken;
    }

}

const makeAuthUseCase = () => {
    return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
    class AuthUseCase {
        email!: string;
        password!: string;
        accesToken!:string | null;
        
        auth(email: string,password: string): string | null {
            this.email = email;
            this.password = password;
            throw new Error()
        }
    }
    return new AuthUseCase()
}


// SUT = System Under Test (systéme sous test)
// Spy = espion 
const makeSut = () => { 
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy);
    authUseCaseSpy.accesToken = "valid_token"
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
        expect(httpResponse.body).toEqual(new ServerError())
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

    test(`Should return ${StatusCodes.UNAUTHORIZED} when invalid credentials are provided`,() => {
        const { sut, authUseCaseSpy } = makeSut();
        authUseCaseSpy.accesToken = null
        const httpRequest: httpRequest = {
            body: {
                email: "any_email@gmail.com",
                password: "any_password"
            },
            statusCode: 0
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        expect(httpResponse.body).toEqual(new UnauthorizedError())
    })

    test(`Should return ${StatusCodes.OK} when valid credentials are provided`,() => {
        const { sut, authUseCaseSpy } = makeSut();
        const httpRequest: httpRequest = {
            body: {
                email: "valide_email@gmail.com",
                password: "valide_password"
            },
            statusCode: 0
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.OK);
        expect(httpResponse.body).toEqual(authUseCaseSpy.accesToken);
    })

    test(`Should return ${StatusCodes.INTERNAL_SERVER_ERROR} if AuthUseCase throws`,() => {
        const authUseCaseSpy = makeAuthUseCaseWithError();
        const sut = new LoginRouter(authUseCaseSpy)
        const httpRequest: httpRequest = {
            body: {
                email: "valide_email@gmail.com",
                password: "valide_password"
            },
            statusCode: 0
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(httpResponse.body).toEqual(new ServerError());
    })

})