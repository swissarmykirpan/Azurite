export default class InternalAzuriteError extends Error {
    constructor(msg: string) {
        super(msg);
        this.message = this.generateErrorMessage(msg);
        Error.captureStackTrace(this, this.constructor);
    }

    private generateErrorMessage(msg: string) {
        return `*Internal Azurite Error*: ${msg}`;
    }
}