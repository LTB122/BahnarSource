import { UploadValidatorStrategy } from "./interface";

export default class SingleFileStrategy implements UploadValidatorStrategy {
    private constraints;

    constructor(
        constraints: {
            /* TODO: Add more constraints in the future */
            mimetypes?: string[];
        } = {}
    ) {
        this.constraints = constraints;
    }

    validate(files: Express.Multer.File[]): void {
        if (!files) {
            throw Error("Cannot read file.");
        }
        if (files.length !== 1) {
            throw new Error(`You must upload exactly one file for this operation`);
        }

        files.forEach((file: Express.Multer.File) => {
            if (
                this.constraints.mimetypes &&
                !this.constraints.mimetypes?.some((mime: string) => file.mimetype === mime)
            ) {
                throw Error(`Invalid mimetype`);
            }
        });
    }
}
