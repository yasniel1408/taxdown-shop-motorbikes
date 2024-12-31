import { inject, injectable } from 'tsyringe';
import { DynamoDBCustomerAdapter } from '../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter';
import { CustomerDtoResponse } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoResponse';

@injectable()
export class GetCustomerByIdService {
  constructor(
    @inject("DynamoDBCustomerAdapter")
    private readonly customerdb: DynamoDBCustomerAdapter
) {}

  async execute(customerId: string): Promise<CustomerDtoResponse> {
    const customerDao = await this.customerdb.findById(customerId);
    if (!customerDao) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    return {
      userId: customerDao.userId,
      name: customerDao.name,
      email: customerDao.email,
      phone: customerDao.phone,
      availableCredit: customerDao.availableCredit,
      createdAt: customerDao.createdAt
    };
  }
}
