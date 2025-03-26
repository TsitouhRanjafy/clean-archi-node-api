import { StatusCodes } from "http-status-codes"
import { httpRequest, login } from "../../core/entities/http"
import { MissingParamError } from "../helpers/missing-param.error"
import { AuthUseCase } from "../../../test/login-router.spec"

export class LoginRouter {
    authUseCase: AuthUseCase;

    constructor(authUseCase: AuthUseCase){
        this.authUseCase = authUseCase
    }
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
        this.authUseCase.auth(email,password);
        return {
            body: { email: '',password: '' },
            statusCode: StatusCodes.UNAUTHORIZED
        }
    }
}