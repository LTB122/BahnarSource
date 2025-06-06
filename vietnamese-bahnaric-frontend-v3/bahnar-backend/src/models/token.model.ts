import mongoose, { Document, Schema } from "mongoose";

export type TokenDocument = Document & {
    userId: mongoose.Types.ObjectId;
    createdAt: number;
    expiredAt: number;
    userAgent: string;
};

const tokenSchema = new Schema<TokenDocument>({
    userId: Schema.Types.ObjectId,
    createdAt: Number,
    expiredAt: Number,
    userAgent: String
});

export function parseTokenMeta(tokenMeta: any): TokenDocument {
    return {
        ...tokenMeta,
        _id: mongoose.Types.ObjectId.createFromHexString(tokenMeta._id),
        userId: mongoose.Types.ObjectId.createFromHexString(tokenMeta.userId)
    };
}

const Token = mongoose.model<TokenDocument>("token", tokenSchema);
export default Token;
