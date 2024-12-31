import { DynamoDBCustomerAdapter } from '../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter';

export class DeleteCustomerService {
  constructor(private readonly customerdb: DynamoDBCustomerAdapter) {}

  async execute(customerId: string): Promise<void> {
    await this.customerdb.delete(customerId);
  }
}
