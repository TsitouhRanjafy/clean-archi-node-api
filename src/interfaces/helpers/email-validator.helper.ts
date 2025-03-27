export class EmailValidator {
    #emailRegex = /email/

    isValid(email: string): boolean {
        return this.#emailRegex.test(email);
    }
}