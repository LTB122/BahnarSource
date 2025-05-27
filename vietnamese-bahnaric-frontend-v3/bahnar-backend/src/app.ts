import http from "http";

import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import express, { Express } from "express";
import useragent from "express-useragent";
import mongoose from "mongoose";
import passport from "passport";
import { Server } from "socket.io";

import { COOKIE_KEY, DB_URI, SERVICE_NAME, STATIC_DIR } from "./config";
import { Controller } from "./controllers";
import logger from "./lib/logger";
import { ExpressMiddleware, Request, Response } from "./types";

class App {
    public app: Express;

    public server: http.Server;

    public port: number;

    public io: Server;

    constructor(controllers: Controller[], port: number, middlewares: ExpressMiddleware[]) {
        this.app = express();
        this.port = port;

        Promise.all([this.connectToDatabase()]).then(() => {
            this.initializeMiddlewares(middlewares);
            this.initializeControllers(controllers);
            this.initialize404route();
            this.initializeErrorHandlerMiddleware();
        });
    }

    private initializeMiddlewares(middlewares: ExpressMiddleware[]) {
        this.app.disable("x-powered-by");
        this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
        this.app.use(bodyParser.json({ limit: "50mb" }));
        this.app.use(cors());
        this.app.use(useragent.express());

        this.app.use("/static", express.static(STATIC_DIR));

        middlewares.forEach((middleware) => this.app.use(middleware));
        this.app.use(passport.session());
        this.app.use(
            cookieSession({
                maxAge: 24 * 60 * 60 * 1000,
                keys: [COOKIE_KEY]
            })
        );
    }

    public applyExternalMiddleware(middleware: ExpressMiddleware) {
        this.app.use(middleware);
    }

    private async connectToDatabase() {
        mongoose.connect(DB_URI);
        mongoose.connection.once("connected", () => {
            logger.info(`[MONGODB] connected!`);
        });
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });
    }

    private initialize404route() {
        this.app.use((_req: Request, res: Response) => {
            res.status(404).send("Route not found");
        });
    }

    private initializeErrorHandlerMiddleware() {
        this.app.use((error: Error, _req: Request, res: Response) => {
            logger.error("[INTERNAL_ERROR] at", error);
            res.composer.internalError(error.message, error);
        });
    }

    public listen() {
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: "*",
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                preflightContinue: false,
                optionsSuccessStatus: 204
            }
        });

        this.server.listen(this.port, () => {
            logger.info(`[${SERVICE_NAME}] listening on port ${this.port}`);
        });
    }
}

export default App;
