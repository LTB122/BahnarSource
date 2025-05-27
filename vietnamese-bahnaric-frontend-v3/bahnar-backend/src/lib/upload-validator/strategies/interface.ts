export interface UploadValidatorStrategy {
    validate(files: Express.Multer.File[]): void;
}
