import { NextFunction } from "express";

import { Response, Request } from "../types";

export enum HttpResponseStatusCode {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_ALLOWED = 403,
    NOT_FOUND = 404,
    LOCKED = 423,
    INTERNAL_ERROR = 500
}

export type ResponseData<T> = {
    success: boolean;
    code: number;
    message: string;
    payload: T;
};

export class HttpResponseComposer {
    private res: Response;

    constructor(res: Response) {
        this.res = res;
    }

    private json<T>(success: boolean, code: number, message: string, payload: T) {
        this.res.status(code).send({
            success,
            code,
            message,
            payload
        });
    }

    success<T>(payload: T, message = "") {
        this.json(true, HttpResponseStatusCode.SUCCESS, message, payload);
    }

    badRequest<T>(message = "Parameter not correctly", payload: T = {} as T) {
        this.json(false, HttpResponseStatusCode.BAD_REQUEST, message, payload);
    }

    unauthorized(message = "Authorization failed") {
        this.json(false, HttpResponseStatusCode.UNAUTHORIZED, message, {});
    }

    notAllowed(message = "Forbidden") {
        this.json(false, HttpResponseStatusCode.NOT_ALLOWED, message, {});
    }

    notFound(message = "Resource not found") {
        this.json(false, HttpResponseStatusCode.NOT_FOUND, message, {});
    }

    locked(message = "Unlock code required") {
        this.json(false, HttpResponseStatusCode.LOCKED, message, {});
    }

    internalError<T>(message: string = "Internal error", payload: T = {} as T) {
        this.json(false, HttpResponseStatusCode.INTERNAL_ERROR, message, payload);
    }
}

export function applyHttpResponseComposer(req: Request, res: Response, next: NextFunction) {
    res.composer = new HttpResponseComposer(res);
    next();
}
