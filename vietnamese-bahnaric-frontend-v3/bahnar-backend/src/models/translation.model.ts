import mongoose, { Document, Schema, Types } from "mongoose";

export type TranslationDocument = Document & {
    src: string;
    tgt: string;
    isFavorite: boolean;
    userId: Types.ObjectId;
    createdAt: number;
    deletedAt?: number;
};

const translationSchema = new Schema<TranslationDocument>({
    src: String,
    tgt: String,
    isFavorite: Boolean,
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    createdAt: Number,
    deletedAt: Number
});

const TranslationModel = mongoose.model<TranslationDocument>("translations", translationSchema);
export default TranslationModel;
