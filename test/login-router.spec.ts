import {describe, expect, test} from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import { EmailValidator, LoginRouter } from '../src/interfaces';
import { InvalidParamError, MissingParamError, ServerError, UnauthorizedError } from '../src/interfaces/errors';
import { TokenGenerator } from '../src/framework';
import { AuthUseCase, httpRequest } from '../src/core';



const makeAuthUseCase = () => {
    return new AuthUseCase(new TokenGenerator)
}

const makeAuthUseCaseWithError = (): AuthUseCase => {
    class AuthUseCaseWithEror extends AuthUseCase {

        async authentificate(email: string,password: string): Promise<string | null> { // eslint-disable-line 
            throw new Error();
        }
    }
    return new AuthUseCaseWithEror(new TokenGenerator)
}

const makeEmailValidator = () => {
    return new EmailValidator();
}

// SUT = System Under Test (systéme sous test)
// Spy = espion 
const makeSut = () => { 
    const authUseCaseSpy = makeAuthUseCase();
    const emailValidatorSpy = makeEmailValidator();
    const sut = new LoginRouter(authUseCaseSpy,emailValidatorSpy);
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

    test(`Should return ${StatusCodes.UNAUTHORIZED} when invalid credentials are provided`,async () => {
        const { sut } = makeSut();
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
        const { sut } = makeSut();
        const httpRequest: httpRequest = {
            body: {
                email: "valide_email@gmail.com",
                password: "valide_password"
            },
            statusCode: 0
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.OK);
        expect(httpResponse.body).toBeTruthy()
    })

    test(`Should return ${StatusCodes.INTERNAL_SERVER_ERROR} if AuthUseCase throws`,async () => {
        const authUseCaseSpy: AuthUseCase= makeAuthUseCaseWithError();
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
                password: "valide_password"
            },
            statusCode: 0
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    // test pour interaction avec un bd (simulation)
})