import { CustomerDtoRequest } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoRequest';
import { DynamoDBCustomerAdapter } from '../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter';

export class GetAllCustomersService  {
  constructor(private readonly customerdb: DynamoDBCustomerAdapter) {}

  async execute(): Promise<CustomerDtoRequest[]> {
    const customers = await this.customerdb.findAll();

    return customers.map(customer => ({
      userId: customer.userId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      availableCredit: customer.availableCredit,
      createdAt: customer.createdAt.toISOString()
    }));
  }
}
