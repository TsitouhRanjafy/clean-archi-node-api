import { StatusCodes } from "http-status-codes";
import { httpRequest, login } from "../../core/entities/http";
import { MissingParamError } from "../helpers/missing-param.error";
import { AuthUseCaseSpy } from "../../../test/login-router.spec";
import { UnauthorizedError } from "../helpers/unauthorized.error";
import { ServerError } from "../helpers/server.error";
import { InvalidParamError } from "../helpers/Invalid-param.error";



export class LoginRouter {
    authUseCase: AuthUseCaseSpy;

    constructor(authUseCase: AuthUseCaseSpy){
        this.authUseCase = authUseCase
    }

    async route(httpRequest: httpRequest): Promise<httpRequest> {
        try {
            const { email,password } = httpRequest.body as login
            if (!email || !password){
                return {
                    body: new MissingParamError('email or password'),
                    statusCode: StatusCodes.BAD_REQUEST
                }
            }
            if (!/email/.test(email)){
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