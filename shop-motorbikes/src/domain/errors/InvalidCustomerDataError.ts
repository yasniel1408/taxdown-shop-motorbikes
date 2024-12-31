import { BaseError } from './BaseError';

export class InvalidCustomerDataError extends BaseError {
    constructor(message: string) {
        super(400, message);
    }
}
