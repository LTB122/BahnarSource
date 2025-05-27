import "reflect-metadata";

import { toNumber } from "lodash";

import App from "./app";
import { PORT } from "./config";
import container from "./container";
import { AuthController, TranslationController, UserController, WebTranslationController } from "./controllers";
import { applyHttpResponseComposer } from "./lib/response-composer";
import { AuthService, TranslationService, UserService } from "./services";
import { ServiceType } from "./types";

// Binding service
container.bind<AuthService>(ServiceType.Auth).to(AuthService).inSingletonScope();
container.bind<UserService>(ServiceType.User).to(UserService).inSingletonScope();
container
    .bind<TranslationService>(ServiceType.Translation)
    .to(TranslationService)
    .inSingletonScope();

const app = new App(
    [
        container.resolve<AuthController>(AuthController),
        container.resolve<TranslationController>(TranslationController),
        container.resolve<WebTranslationController>(WebTranslationController),
        container.resolve<UserController>(UserController)
    ],
    toNumber(PORT),
    [applyHttpResponseComposer, container.get<AuthService>(ServiceType.Auth).applyMiddleware()]
);

app.listen();
