import { Router } from "express";
import { inject, injectable } from "inversify";

import { TranslationService } from "../services";
import { Request, Response, ServiceType } from "../types";

import Controller from "./controller";

@injectable()
class WebTranslationController extends Controller {
    public readonly router: Router = Router();

    public readonly path: string = "/translateBahnar";

    constructor(@inject(ServiceType.Translation) private translationService: TranslationService) {
        super();

        this.router.post("/", this.translateBahnar.bind(this));
        this.router.post("/voice", this.getVoice.bind(this));
    }

    public async translateBahnar(req: Request, res: Response): Promise<void> {
        try {
            const { text } = req.body;

            const translation: string = await this.translationService.translate(text);

            res.composer.success(translation);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }

    public async getVoice(req: Request, res: Response): Promise<void> {
        try {
            const { text, gender, region } = req.body;

            const voiceURL: string = await this.translationService.getBahnarVoice(
                text,
                gender,
                region
            );

            res.composer.success(voiceURL);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }
}

export default WebTranslationController;
