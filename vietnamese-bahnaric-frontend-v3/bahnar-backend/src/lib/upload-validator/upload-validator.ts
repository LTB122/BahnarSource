import { UploadValidatorStrategy } from "./strategies/interface";
import SingleFileStrategy from "./strategies/single-file";

class UploadValidator {
    strategy: UploadValidatorStrategy;

    constructor(s: UploadValidatorStrategy = new SingleFileStrategy()) {
        this.strategy = s;
    }

    setStrategy(s: UploadValidatorStrategy) {
        this.strategy = s;
    }

    /**
     * Validates the files given according to the strategies
     * Will throw an error if validation fails
     */
    validate(files: Express.Multer.File[]) {
        this.strategy.validate(files);
    }
}

export default UploadValidator;
