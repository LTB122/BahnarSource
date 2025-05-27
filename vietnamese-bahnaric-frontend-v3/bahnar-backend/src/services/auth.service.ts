import bcrypt from "bcryptjs";
import { NextFunction } from "express";
import { injectable } from "inversify";
import jwt from "jwt-simple";
import _, { toNumber } from "lodash";
import moment from "moment";
import { Types, UpdateWriteOpResult } from "mongoose";
import passport from "passport";
import { Strategy, ExtractJwt, StrategyOptions, VerifiedCallback } from "passport-jwt";

import { HASH_ROUNDS, JWT_SECRET, TOKEN_TTL } from "../config";
import { lazyInject } from "../container";
import logger from "../lib/logger";
import Token, { TokenDocument, parseTokenMeta } from "../models/token.model";
import { UserDocument } from "../models/user.model";
import { Request, Response, ServiceType } from "../types";

import { UserService } from "./index";

@injectable()
class AuthService {
    @lazyInject(ServiceType.User) private userService: UserService;

    constructor() {
        logger.info(`[Auth] Constructing Auth service...`);
    }

    public applyMiddleware() {
        const options: StrategyOptions = {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        };
        const strategyJwt = new Strategy(options, this.verifyAccountCode.bind(this));
        passport.use(strategyJwt);

        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((user, done) => {
            done(null, user);
        });

        return passport.initialize();
    }

    private async verifyAccountCode(payload: any, done: VerifiedCallback) {
        const tokenMeta: TokenDocument = parseTokenMeta(payload);

        try {
            const token: TokenDocument = await Token.findOne({
                _id: tokenMeta._id
            });
            if (!token) {
                return done(null, false, "Invalid token");
            }

            if (token.expiredAt < moment().unix()) {
                return done(null, false, "Token expired");
            }

            return done(null, token);
        } catch (error) {
            return done(error, null);
        }
    }

    public authenticate(block = true) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                passport.authenticate("jwt", async (_err, tokenMeta: TokenDocument) => {
                    req.tokenMeta = tokenMeta;
                    if (!block || _.isEmpty(tokenMeta) || tokenMeta.expiredAt < moment().unix()) {
                        res.composer.unauthorized();
                        return;
                    }

                    next();
                })(req, res, next);
            } catch (err) {
                logger.error(err);
            }
        };
    }

    private async hashPassword(password: string) {
        const salt: string = await bcrypt.genSalt(HASH_ROUNDS);
        const hash: string = await bcrypt.hash(password, salt);

        return hash;
    }

    private async createToken(userId: string, userAgent: string) {
        const result: TokenDocument = await Token.create({
            userAgent,
            userId,
            createdAt: moment().unix(),
            expiredAt: moment().unix() + toNumber(TOKEN_TTL)
        });
        const EncodeToken: string = jwt.encode(
            {
                _id: result._id,
                userAgent,
                userId,
                createdAt: moment().unix(),
                expiredAt: moment().unix() + toNumber(TOKEN_TTL)
            },
            JWT_SECRET
        );

        return EncodeToken;
    }

    /**
     * Login logic
     * @param username username
     * @param password plain text password
     * @returns token
     */
    public async login(username: string, password: string): Promise<string> {
        const user: UserDocument = await this.userService.findOne({
            username
        });

        if ((await bcrypt.compare(password, user.password)) === false) {
            throw new Error("Mật khẩu không đúng");
        }

        if (!user) {
            throw new Error("username không đúng");
        }

        const token: string = await this.createToken(user._id, username);

        return token;
    }

    /**
     * Signup
     */
    public async signup(username: string, password: string): Promise<void> {
        if (password.length < 6) {
            throw new Error("Mật khẩu phải trên 5 ký tự.");
        }

        const hashedPassword: string = await this.hashPassword(password);

        const user: UserDocument = await this.userService.create(username, hashedPassword);

        await this.createToken(user._id, username);
    }

    /**
     * Change password
     */
    public async changePassword(
        userId: Types.ObjectId,
        oldPassword: string,
        newPassword: string
    ): Promise<void> {
        const user: UserDocument = await this.userService.findOne({ _id: userId });

        if ((await bcrypt.compare(oldPassword, user.password)) === false) {
            throw new Error("Mật khẩu không đúng");
        }

        if (newPassword.length < 6) {
            throw new Error("Mật khẩu phải trên 5 ký tự.");
        }

        const hashedNewPassword: string = await this.hashPassword(newPassword);

        user.password = hashedNewPassword;
        await user.save();
    }

    /**
     * Logout
     */
    public async expireAllTokens(userId: Types.ObjectId): Promise<UpdateWriteOpResult> {
        const result: UpdateWriteOpResult = await Token.updateMany(
            {
                userId,
                expiredAt: {
                    $gt: moment().unix()
                }
            },
            {
                expiredAt: moment().unix() - 1
            },
            {
                multi: true
            }
        );

        return result;
    }
}

export default AuthService;
