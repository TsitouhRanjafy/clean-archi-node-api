import { MissingParamError } from "../../interfaces/helpers/missing-param.error";

export interface login {
    password: string,
    email: string
}

export interface httpRequest {
    body: login | MissingParamError | string
    statusCode: number;
}