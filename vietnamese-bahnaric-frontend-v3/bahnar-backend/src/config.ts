import path from "path";

import dotenv from "dotenv";
import { toNumber } from "lodash";

dotenv.config();

export const WORKING_DIR = path.resolve(".");
export const STATIC_DIR = path.join(WORKING_DIR, "static");
export const UPLOAD_DIR = path.join(WORKING_DIR, "uploads");

export const PORT = process.env.PORT as string;

export const DB_URI = process.env.DB_URI as string;

export const SERVICE_NAME = process.env.SERVICE_NAME as string;

export const TOKEN_TTL = process.env.TOKEN_TTL as string;

export const COOKIE_KEY = process.env.COOKIE_KEY as string;

export const JWT_SECRET = process.env.JWT_SECRET as string;

export const HASH_ROUNDS: number = toNumber(process.env.HASH_ROUNDS);
