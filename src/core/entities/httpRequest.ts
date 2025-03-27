import { MissingParamError } from "../../interfaces/errors";
import { ServerError } from "../../interfaces/errors";

export interface login {
    password: string,
    email: string
}

export interface httpRequest {
    body: login | MissingParamError | string | ServerError
    statusCode: number;
}