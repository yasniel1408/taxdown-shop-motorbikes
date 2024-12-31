import { BaseError } from './BaseError';

export class CreditNotNegativeError extends BaseError {
    constructor() {
        super(400, 'Credit amount cannot be negative');
    }
}