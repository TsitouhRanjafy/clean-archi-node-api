import {describe, expect, test} from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import { LoginRouter } from '../src/interfaces/routes/login.router';
import { MissingParamError } from '../src/interfaces/helpers/missing-param.error';
import { httpRequest, login } from '../src/core/entities/http';
import { UnauthorizedError } from '../src/interfaces/helpers/unauthorized.error';
import { ServerError } from '../src/interfaces/helpers/server.error';
import { InvalidParamError } from '../src/interfaces/helpers/invalid-param.error';


export class AuthUseCaseSpy {
    email!: string;
    password!: string;
    accesToken!:string | null;
    
    async auth(email: string,password: string): Promise<string | null> { // eslint-disable-line 
        this.email = email;
        this.password = password;
        return this.accesToken;
    }

}

export class EmailValidatorSpy {
    #emailRegex = /email/

    isValid(email: string): boolean {
        return this.#emailRegex.test(email);
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
        
        async auth(email: string,password: string): Promise<string | null> { // eslint-disable-line 
            this.email = email;
            this.password = password;
            throw new Error()
        }
    }
    return new AuthUseCase()
}

const makeEmailValidator = () => {
    return new EmailValidatorSpy();
}

// SUT = System Under Test (systéme sous test)
// Spy = espion 
const makeSut = () => { 
    const authUseCaseSpy = makeAuthUseCase();
    const emailValidatorSpy = makeEmailValidator();
    const sut = new LoginRouter(authUseCaseSpy,emailValidatorSpy);
    authUseCaseSpy.accesToken = "valid_token"
    return {
        sut, 
        authUseCaseSpy,
        emailValidatorSpy
    }
}

describe('Login Router',() => {
    test(`Should return ${StatusCodes.BAD_REQUEST} if no email is provided`,async () => {
        const { sut } = makeSut()
        const httpRequest: httpRequest = {
            body: {
                password: 'any_password',
                email: ''
            },
            statusCode: 0
        } 
        const httpResponse: httpRequest = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(httpResponse.body).toEqual(new MissingParamError('email or password'))
    })

    test(`Should return ${StatusCodes.BAD_REQUEST} if no password is provided`,async () => {
        const { sut } = makeSut()
        const httpRequest: httpRequest = {
            body: {
                password: '',
                email: 'ranjafytsito@gmail.com'
            },
            statusCode: 0
        } 
        const httpResponse: httpRequest = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(httpResponse.body).toEqual(new MissingParamError('email or password'))
    })

    test(`Should return ${StatusCodes.INTERNAL_SERVER_ERROR} if no httpRequest is provided or httpRequest has no body`,async () => {
        const { sut } = makeSut()
        const httpRequest: any = undefined; // eslint-disable-line 
        const httpResponse: httpRequest = await sut.route(httpRequest) // eslint-disable-line 
        expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test(`Should call AuthUseCase with correct params`,async () => {
        const { sut, authUseCaseSpy } = makeSut()
        const httpRequest: httpRequest = {
            body: {
                email: "any_email@gmail.com",
                password: "any_password"
            },
            statusCode: 0
        }
        const body: login = httpRequest.body as login
        await sut.route(httpRequest)
        expect(authUseCaseSpy.email).toBe(body.email)
        expect(authUseCaseSpy.password).toBe(body.password)
    })

    test(`Should return ${StatusCodes.UNAUTHORIZED} when invalid credentials are provided`,async () => {
        const { sut, authUseCaseSpy } = makeSut();
        authUseCaseSpy.accesToken = null
        const httpRequest: httpRequest = {
            body: {
                email: "any_email@gmail.com",
                password: "any_password"
            },
            statusCode: 0
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        expect(httpResponse.body).toEqual(new UnauthorizedError())
    })

    test(`Should return ${StatusCodes.OK} when valid credentials are provided`,async () => {
        const { sut, authUseCaseSpy } = makeSut();
        const httpRequest: httpRequest = {
            body: {
                email: "valide_email@gmail.com",
                password: "valide_password"
            },
            statusCode: 0
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.OK);
        expect(httpResponse.body).toEqual(authUseCaseSpy.accesToken);
    })

    test(`Should return ${StatusCodes.INTERNAL_SERVER_ERROR} if AuthUseCase throws`,async () => {
        const authUseCaseSpy = makeAuthUseCaseWithError();
        const emailValidatorSpy = makeEmailValidator()
        const sut = new LoginRouter(authUseCaseSpy,emailValidatorSpy)
        const httpRequest: httpRequest = {
            body: {
                email: "valide_email@gmail.com",
                password: "valide_password"
            },
            statusCode: 0
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(httpResponse.body).toEqual(new ServerError());
    })

    test(`Should return ${StatusCodes.BAD_REQUEST} if an invalid email is provided`,async () => {
        const { sut } = makeSut()
        const httpRequest: httpRequest = {
            body: {
                email: "invalide_@gmail.com",
                password: "any_password"
            },
            statusCode: 0
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    // test(`Should return ${StatusCodes.BAD_REQUEST} if an invalid password is provided`,async () => {
    //     const { sut } = makeSut()
    //     const httpRequest: httpRequest = {
    //         body: {
    //             email: "any_email@gmail.com",
    //             password: "invalid"
    //         },
    //         statusCode: 0
    //     }
    //     const httpResponse = await sut.route(httpRequest)
    //     expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    //     expect(httpResponse.body).toEqual(new InvalidParamError('password'))
    // })

})