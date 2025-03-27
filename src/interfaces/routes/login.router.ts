import { StatusCodes } from "http-status-codes";
import { httpRequest, login } from "../../core/entities/httpRequest";
import { MissingParamError } from "../errors/missing-param.error";
import { AuthUseCaseSpy, EmailValidatorSpy } from "../../../test/login-router.spec";
import { InvalidParamError, ServerError, UnauthorizedError } from "../errors";




export class LoginRouter {

    constructor(
        private authUseCase: AuthUseCaseSpy, 
        private emailValidator: EmailValidatorSpy){}

    async route(httpRequest: httpRequest): Promise<httpRequest> {
        try {
            const { email,password } = httpRequest.body as login
            if (!email || !password){
                return {
                    body: new MissingParamError('email or password'),
                    statusCode: StatusCodes.BAD_REQUEST
                }
            }
            if (!this.emailValidator.isValid(email)){
                return { body: new InvalidParamError('email'),statusCode: StatusCodes.BAD_REQUEST }
            }
            const accessToken = await this.authUseCase.auth(email,password);
            if (!accessToken){
                return {
                    body: new UnauthorizedError(),
                    statusCode: StatusCodes.UNAUTHORIZED
                }
            }
            return {
                statusCode: StatusCodes.OK,
                body: accessToken
            }
        } catch (error) {
            console.log(error);
            return {
                body: new ServerError(),
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR
            }
        }   
    }
}
