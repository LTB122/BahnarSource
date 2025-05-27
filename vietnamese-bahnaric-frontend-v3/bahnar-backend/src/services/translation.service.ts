import axios from "axios";
import { injectable } from "inversify";
import _ from "lodash";
import { FilterQuery, SortOrder, Types } from "mongoose";

import logger from "../lib/logger";
import TranslationModel, { TranslationDocument } from "../models/translation.model";

@injectable()
class TranslationService {
    constructor() {
        logger.info("[Transaction] Init Transaction Service");
    }

    public async translate(text: string): Promise<string> {
        try {
            const apiUrl = "http://localhost:10000/translate/vi_ba";
            const response = await axios.post(apiUrl, { text });
            return response.data;
        } catch (error) {
            logger.error(`Error during translation API request: ${error.message}`);
            throw error;
        }
    }

    public async getBahnarVoice(text: string, gender: string, region: string): Promise<string> {
        try {
            const apiUrl = "http://localhost:10000/speak/vi_ba_v2";
            const response = await axios.post(apiUrl, { text, gender, region });
            return response.data;
        } catch (error) {
            logger.error(`Error during translation API request: ${error.message}`);
            throw error;
        }
    }

    public async create(
        src: string,
        tgt: string,
        userId: Types.ObjectId
    ): Promise<TranslationDocument> {
        return await TranslationModel.create({
            src,
            tgt,
            userId,
            createdAt: Date.now()
        });
    }

    public async findAllByUserId(
        userId: Types.ObjectId,
        filter?: FilterQuery<TranslationDocument>,
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
    ): Promise<TranslationDocument[]> {
        const filterQuery: FilterQuery<TranslationDocument> = _.merge(
            { userId },
            { deletedAt: { $exists: false } },
            filter
        );
        const query = TranslationModel.find(filterQuery);
        if (option) {
            if (option.limit) query.limit(option.limit);
            if (option.sort) query.sort(option.sort);
            if (option.offset) query.skip(option.offset);
            if (option.lean) query.lean();
        }

        return await query.exec();
    }

    public async findById(id: Types.ObjectId) {
        return await TranslationModel.findById(id);
    }

    public async markFavorite(
        id: Types.ObjectId,
        isFavorite: boolean = true
    ): Promise<TranslationDocument> {
        logger.info(`[Transaction] Mark favorite translation ${id} as ${isFavorite}`);
        return await TranslationModel.findByIdAndUpdate(id, { isFavorite }, { new: true });
    }

    public async markAsDeleted(id: Types.ObjectId): Promise<TranslationDocument> {
        return await TranslationModel.findByIdAndUpdate(
            id,
            { deletedAt: Date.now() },
            { new: true }
        );
    }

    public async markAsDeletedByUserId(userId: Types.ObjectId): Promise<void> {
        await TranslationModel.updateMany(
            { userId, deletedAt: { $exists: false } },
            { deletedAt: Date.now() },
            { new: true }
        ).exec();
    }

    public async countTotal(
        userId: Types.ObjectId,
        filter?: FilterQuery<TranslationDocument>
    ): Promise<{ total: number; favorite: number }> {
        const filterQuery: FilterQuery<TranslationDocument> = _.merge(
            { userId },
            { deletedAt: { $exists: false } }
        );
        const filterQueryFavorite: FilterQuery<TranslationDocument> = _.merge(
            { userId },
            { deletedAt: { $exists: false } },
            filter
        );
        const query = await TranslationModel.find(filterQuery).countDocuments();
        const queryFavorite = await TranslationModel.find(filterQueryFavorite).countDocuments();
        return {
            total: query,
            favorite: queryFavorite
        };
    }
}

export default TranslationService;
