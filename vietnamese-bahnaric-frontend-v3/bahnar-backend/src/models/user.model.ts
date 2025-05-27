import mongoose, { Document, Schema } from "mongoose";

export type UserDocument = Document & {
    name: string;
    gender: "Nam" | "Nữ" | "Khác";
    phone: string;
    picture: string;
    email: string;
    username: string;
    password: string;
    settings: {
        region: "binhdinh" | "kontum" | "gialai";
    };
    createdAt: number;
    deletedAt?: number;
    updatedAt?: number;
};

const userSchema = new Schema<UserDocument>({
    name: {
        type: String,
        default: "Nguời dùng"
    },
    gender: {
        type: String,
        enum: ["Nam", "Nữ", "Khác"]
    },
    phone: String,
    email: String,
    picture: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    settings: {
        region: {
            type: String,
            enum: ["binhdinh", "kontum", "gialai"],
            default: "binhdinh"
        }
    },
    createdAt: Number,
    deletedAt: Number,
    updatedAt: Number
});

const UserModel = mongoose.model<UserDocument>("users", userSchema);
export default UserModel;
