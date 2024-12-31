import { inject, injectable } from 'tsyringe';
import { CustomerDtoRequest } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoRequest';
import { CustomerDao } from '../infrastructure/adapters/out/dynamodb/dao/CustomerDao';
import { DynamoDBCustomerAdapter } from '../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter';

@injectable()
export class GetCustomerByIdService {
  constructor(
    @inject("DynamoDBCustomerAdapter")
    private readonly customerdb: DynamoDBCustomerAdapter
) {}

  async execute(customerId: string): Promise<CustomerDtoRequest> {
    const customer = await this.customerdb.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    const customerDao = await this.customerdb.save({
      userId: customer.userId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      availableCredit: customer.availableCredit,
      createdAt: customer.createdAt
    } as CustomerDao);

    return {
      userId: customerDao.userId,
      name: customerDao.name,
      email: customerDao.email,
      phone: customerDao.phone,
      availableCredit: customerDao.availableCredit,
      createdAt: customerDao.createdAt.toString()
    };
  }
}
