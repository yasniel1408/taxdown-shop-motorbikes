import { inject, injectable } from 'tsyringe';
import { DynamoDBCustomerAdapter } from '../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter';

@injectable()
export class DeleteCustomerService {
  constructor(
    @inject("DynamoDBCustomerAdapter")
    private readonly customerdb: DynamoDBCustomerAdapter
) {}

  async execute(customerId: string): Promise<void> {
    await this.customerdb.delete(customerId);
  }
}
