import { Router } from "express";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { UserDocument } from "../models/user.model";
import { AuthService, UserService } from "../services";
import { Request, Response, ServiceType } from "../types";

import Controller from "./controller";

@injectable()
class AuthController extends Controller {
    public readonly router = Router();

    public readonly path = "/auth";

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.User) private userService: UserService
    ) {
        super();

        this.router.post("/login", this.login.bind(this));

        this.router.post("/signup", this.signup.bind(this));

        this.router.all("*", this.authService.authenticate());

        this.router.post("/password", this.changePassword.bind(this));

        /*
         * @deprecated
         */
        this.router.get("/profile", this.getProfile.bind(this));

        /*
         * @deprecated
         */
        this.router.patch("/profile", this.editProfile.bind(this));
    }

    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                throw new Error("Thiếu username hoặc password!");
            }

            const token: string = await this.authService.login(username, password);

            res.composer.success({ token });
        } catch (error) {
            res.composer.badRequest("Sai username hoặc password!");
        }
    }

    async signup(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                throw new Error("Thiếu username hoặc password!");
            }

            await this.authService.signup(username, password);

            res.composer.success("Đăng ký thành công!");
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    public async changePassword(req: Request, res: Response) {
        try {
            const { newPassword, oldPassword } = req.body;
            const { userId } = req.tokenMeta;

            if (!newPassword || !oldPassword || !userId) {
                throw new Error("Thiếu mật khẩu cũ hoặc mật khẩu mới");
            }

            await this.authService.changePassword(userId, oldPassword, newPassword);

            await this.authService.expireAllTokens(userId);

            res.composer.success("Đổi mật khẩu thành công");
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    /**
     * @deprecated
     */
    async getProfile(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;

            const user: UserDocument = await this.userService.findOne({ _id: userId });

            res.composer.success(user);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }

    /**
     * @deprecated
     */
    async editProfile(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;

            const user: UserDocument = await this.userService.updateOne(
                new Types.ObjectId(userId),
                req.body
            );

            res.composer.success(user);
        } catch (error) {
            res.composer.badRequest(error);
        }
    }
}

export default AuthController;
