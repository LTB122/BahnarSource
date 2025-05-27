import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export default abstract class Controller {
    public abstract readonly router: Router;

    public abstract readonly path: string;
}
