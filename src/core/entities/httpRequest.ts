import { MissingParamError } from "../errors/missing-param.error";
import { ServerError } from "../errors/server.error";
import { login } from "./type";


export interface httpRequest {
    body: login | MissingParamError | string | ServerError
    statusCode: number;
}
