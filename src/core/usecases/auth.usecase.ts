import { TokenGenerator } from "../../framework";

export class AuthUseCase {
    constructor(private tokenGenerator: TokenGenerator){}
    

    async authentificate(email: string,password: string): Promise<string | null> { // eslint-disable-line 

        let accesToken: string | null = null
        if (email == 'valide_email@gmail.com' && password == 'valide_password'){
            accesToken = this.tokenGenerator.generate("user_id");
        }
        return accesToken;
    }
}