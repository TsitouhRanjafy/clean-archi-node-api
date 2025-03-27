import {describe, expect, test} from '@jest/globals';
import { AuthUseCase } from '../src/core';
import { TokenGenerator } from '../src/framework';

const makeSut = () => {
    return new AuthUseCase(new TokenGenerator);
}

describe('Auth UseCase',() => {
    test('Should return null if an invalid email is provided', async () => {
        const sut = makeSut()
        const accessToken = await sut.authentificate('invalid_email@mail.com', 'valide_password')
        expect(accessToken).toBeNull()
    })

    test('Should return null if an invalid password is provided', async () => {
        const sut = makeSut()
        const accessToken = await sut.authentificate('valide_email@mail.com', 'invalid_password')
        expect(accessToken).toBeNull()
    })

    test('Should return string (token) if an valid email and password is provided', async () => {
        const sut = makeSut()
        const accessToken = await sut.authentificate('valide_email@gmail.com', 'valide_password')
        expect(accessToken).not.toBeNull()
    })  

    // test('Should call TokenGenerator with correct userId',() => {

    // })
})