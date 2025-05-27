import { Router } from "express";
import { inject, injectable } from "inversify";
import _ from "lodash";
import { SortOrder, Types } from "mongoose";

import { TranslationDocument } from "../models/translation.model";
import { AuthService, TranslationService } from "../services";
import { Request, Response, ServiceType } from "../types";

import Controller from "./controller";

@injectable()
class TranslationController extends Controller {
    public readonly router: Router = Router();

    public readonly path: string = "/translations";

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Translation) private translationService: TranslationService
    ) {
        super();

        this.router.all("*", this.authService.authenticate());

        this.router.get("/", this.findAll.bind(this));

        this.router.get("/:translationId", this.findOneById.bind(this));

        this.router.post("/", this.create.bind(this));

        this.router.patch("/:translationId/favorite", this.markFavorite.bind(this));

        this.router.delete("/:translationId", this.markAsDeleted.bind(this));

        this.router.post("/translateBahnar", this.translateBahnar.bind(this));

        this.router.post("/total", this.countTotal.bind(this));
    }

    public async findAll(req: Request, res: Response): Promise<void> {
        try {
            const { tokenMeta } = req;
            if (!tokenMeta) throw new Error("User not found");

            const { userId } = tokenMeta;

            const isFavorite: boolean | undefined = req.query.isFavorite
                ? Boolean(req.query.isFavorite)
                : undefined;

            const sortBy = req.query.sortBy as string;
            const order = req.query.order as string;
            const sortQuery: {
                [key: string]: SortOrder;
            } = {};
            if (sortBy) {
                sortQuery[sortBy] = (order as "asc" | "desc") || "asc";
            }

            const translations: TranslationDocument[] =
                await this.translationService.findAllByUserId(
                    userId,
                    isFavorite && { isFavorite },
                    {
                        limit: _.toNumber(req.query.limit) || undefined,
                        offset: _.toNumber(req.query.offset) || undefined,
                        sort: sortQuery
                    }
                );

            res.composer.success(translations);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }

    public async findOneById(req: Request, res: Response): Promise<void> {
        try {
            const { translationId } = req.params;
            const translation = await this.translationService.findById(
                new Types.ObjectId(translationId)
            );
            res.composer.success(translation);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { tokenMeta } = req;
            if (!tokenMeta) throw new Error("User not found");

            const { userId } = tokenMeta;

            const { src, tgt } = req.body;

            const translation: TranslationDocument = await this.translationService.create(
                src,
                tgt,
                userId
            );

            res.composer.success(translation);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }

    public async markFavorite(req: Request, res: Response): Promise<void> {
        try {
            const { translationId } = req.params;

            const { isFavorite } = req.body;

            if (!Types.ObjectId.isValid(translationId)) {
                throw new Error("Invalid translation id");
            }

            const translation: TranslationDocument = await this.translationService.markFavorite(
                new Types.ObjectId(translationId),
                !!isFavorite
            );

            res.composer.success(translation);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }

    public async markAsDeleted(req: Request, res: Response): Promise<void> {
        try {
            const { translationId } = req.params;

            if (!Types.ObjectId.isValid(translationId)) {
                throw new Error("Invalid translation id");
            }

            const translation: TranslationDocument = await this.translationService.markAsDeleted(
                new Types.ObjectId(translationId)
            );

            res.composer.success(translation);
        } catch (error) {
            res.composer.badRequest(error);
        }
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

    public async countTotal(req: Request, res: Response): Promise<void> {
        try {
            const { tokenMeta } = req;
            if (!tokenMeta) throw new Error("User not found");

            const { userId } = tokenMeta;

            const isFavorite: boolean = true;

            const total: {
                total: number;
                favorite: number;
            } = await this.translationService.countTotal(userId, isFavorite && { isFavorite });

            res.composer.success(total);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }
}

export default TranslationController;
