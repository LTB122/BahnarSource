import { injectable } from "inversify";
import _ from "lodash";
import moment from "moment";
import { FilterQuery, ProjectionType, QueryOptions, SortOrder, Types } from "mongoose";

import logger from "../lib/logger";
import UserModel, { UserDocument } from "../models/user.model";

@injectable()
class UserService {
    constructor() {
        logger.info("[User] Constructing User service...");
    }

    async create(username: string, password: string) {
        const user: UserDocument = await UserModel.findOne({ username });

        if (user && !user.deletedAt) {
            throw new Error("User already exists");
        }

        if (user && user.deletedAt) {
            return await UserModel.findOneAndUpdate(
                user._id,
                {
                    $unset: {
                        deletedAt: 1
                    },
                    $set: {
                        password
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        }

        return await UserModel.create({
            username,
            password,
            createdAt: moment().unix(),
            updatedAt: moment().unix()
        });
    }

    public async findAll(
        filter?: FilterQuery<UserDocument>,
        option?: {
            limit?: number;
            sort?:
                | string
                | { [key: string]: SortOrder | { $meta: "textScore" } }
                | undefined
                | null;
            offset?: number;
            lean?: boolean;
        }
    ) {
        const filterQuery: FilterQuery<UserDocument> = filter.deletedAt
            ? filter
            : { ...filter, deletedAt: { $exists: false } };

        let findQuery = UserModel.find(filterQuery);

        if (option) {
            if (option.sort) findQuery = findQuery.sort();
            if (option.limit) findQuery = findQuery.limit(option.limit);
            if (option.offset) findQuery = findQuery.skip(option.offset);
            if (option.lean === undefined || option.lean === true) findQuery.lean();
        }

        return await findQuery;
    }

    async findOne(
        query: FilterQuery<UserDocument>,
        projection: ProjectionType<UserDocument> = {},
        options: QueryOptions<UserDocument> = {}
    ) {
        const filterQuery: FilterQuery<UserDocument> = query.deletedAt
            ? query
            : { ...query, deletedAt: { $exists: false } };

        return await UserModel.findOne(filterQuery, projection, options);
    }

    async updateOne(
        userId: Types.ObjectId,
        update: Omit<
            UserDocument,
            "_id" | "createdAt" | "updatedAt" | "updatedAt" | "deletedAt" | "password"
        >
    ) {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                ...update,
                updatedAt: moment().unix()
            },
            {
                new: true,
                runValidators: true
            }
        );
    }

    async deleteOne(userId: Types.ObjectId) {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                deletedAt: Date.now()
            },
            {
                new: true,
                runValidators: true
            }
        );
    }
}

export default UserService;
