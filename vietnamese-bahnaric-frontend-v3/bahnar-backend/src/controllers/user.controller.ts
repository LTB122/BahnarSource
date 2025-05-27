import _ from "lodash";
import { Router } from "express";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { UserDocument } from "../models/user.model";
import { AuthService, TranslationService, UserService } from "../services";
import { Request, Response, ServiceType } from "../types";

import Controller from "./controller";

@injectable()
class UserController extends Controller {
    public readonly router = Router();

    public readonly path = "/users";

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Translation) private translationService: TranslationService
    ) {
        super();

        this.router.all("*", this.authService.authenticate());

        this.router.get("/me", this.getProfile.bind(this));

        this.router.patch("/me", this.editProfile.bind(this));

        this.router.delete("/me", this.deleteAccount.bind(this));
    }

    async getProfile(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;

            const user: UserDocument = await this.userService.findOne({ _id: userId });

            res.composer.success(user);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }

    async editProfile(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;

            const allowEditUpdate = _.omit<
                UserDocument,
                "_id" | "createdAt" | "updatedAt" | "deletedAt" | "password"
            >(req.body, ["_id", "createdAt", "updatedAt", "deletedAt", "password"]);

            const user: UserDocument = await this.userService.updateOne(
                new Types.ObjectId(userId),
                allowEditUpdate
            );

            res.composer.success(user);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }

    async deleteAccount(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;

            await this.userService.deleteOne(userId);
            await Promise.all([
                this.authService.expireAllTokens(userId),
                this.translationService.markAsDeletedByUserId(userId)
            ]);

            res.composer.success("Xóa tài khoản thành công!");
        } catch (error) {
            res.composer.badRequest(error);
        }
    }
}

export default UserController;
