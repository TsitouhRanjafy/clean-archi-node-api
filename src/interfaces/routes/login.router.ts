import { StatusCodes } from "http-status-codes"
import { httpRequest, login } from "../../core/entities/http"
import { MissingParamError } from "../helpers/missing-param.error"

export class LoginRouter {
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
        return {
            body: { email,password },
            statusCode: StatusCodes.OK
        }
    }
}