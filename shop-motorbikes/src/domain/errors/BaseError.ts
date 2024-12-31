export abstract class BaseError extends Error {
    public readonly status: number;

    constructor(
        status: number,
        message: string
    ) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}