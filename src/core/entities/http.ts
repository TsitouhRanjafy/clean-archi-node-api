import { MissingParamError } from "../../interfaces/helpers/missing-param.error";
import { ServerError } from "../../interfaces/helpers/server.error";

export interface login {
    password: string,
    email: string
}

export interface httpRequest {
    body: login | MissingParamError | string | ServerError
    statusCode: number;
}