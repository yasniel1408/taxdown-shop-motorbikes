import { BaseError } from './BaseError';

export class CustomerNotFoundError extends BaseError {
    constructor() {
        super(404, 'Customer not found');
    }
}