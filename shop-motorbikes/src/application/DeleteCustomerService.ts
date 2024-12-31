import { inject } from 'tsyringe';
import { CustomerDatabasePort } from '../domain/ports/out/CustomerDatabasePort';
import { CustomerDao } from '../infrastructure/adapters/out/dynamodb/dao/CustomerDao';

export class DeleteCustomerService {
  constructor(
    @inject("CustomerDatabasePort")
    private readonly customerdb: CustomerDatabasePort<CustomerDao>
) {}

  async execute(customerId: string): Promise<void> {
    await this.customerdb.delete(customerId);
  }
}
