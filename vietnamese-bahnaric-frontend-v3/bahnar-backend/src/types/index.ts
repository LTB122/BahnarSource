import express, { Request as ERequest, Response as EResponse } from "express";

import { HttpResponseComposer } from "../lib/response-composer";
import { TokenDocument } from "../models/token.model";

export interface Request extends ERequest {
    tokenMeta?: TokenDocument;
}

export interface Response extends EResponse {
    composer?: HttpResponseComposer;
}

export const ServiceType = {
    Auth: Symbol.for("AuthService"),
    User: Symbol.for("UserService"),
    Translation: Symbol.for("TranslationService")
};

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export type ExpressMiddleware = express.RequestHandler | express.ErrorRequestHandler;

export type DownloadFileInfo = {
    originalName: string;
    filename: string;
    refName: string;
    mimetype: string;
    buffer: Buffer;
};
