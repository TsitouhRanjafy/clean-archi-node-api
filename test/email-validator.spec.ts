import {describe, expect, test} from '@jest/globals';
import { EmailValidator } from '../src/interfaces/helpers';

describe('Email Validator',() => {
    test('Should return true if validator returns true.',() => {
        const sut = new EmailValidator();
        expect(sut.isValid('valid_email@gmail.com')).toBe(true)
    })

    test('Should return false if validator returns false.',() => {
        const sut = new EmailValidator();
        expect(sut.isValid('invalid_@gmail.com')).toBe(false)
    })
})