import { inject } from 'tsyringe';
import { CustomerDatabasePort } from '../domain/ports/out/CustomerDatabasePort';
import { CustomerDtoRequest } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoRequest';
import { CustomerDao } from '../infrastructure/adapters/out/dynamodb/dao/CustomerDao';

export class GetAllCustomersService  {
  constructor(
    @inject("CustomerDatabasePort")
    private readonly customerdb: CustomerDatabasePort<CustomerDao>
) {}

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
