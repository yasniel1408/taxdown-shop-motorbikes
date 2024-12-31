import { CustomerDtoRequest } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoRequest';
import { UpdateCustomerDtoResponse } from '../infrastructure/adapters/in/http/dtos/request/UpdateCustomerDtoResponse';
import { inject, injectable } from 'tsyringe';
import { DynamoDBCustomerAdapter } from '../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter';

@injectable()
export class UpdateCustomerService {
  constructor(
    @inject("DynamoDBCustomerAdapter")
    private readonly customerdb: DynamoDBCustomerAdapter
) {}

  async execute(customerId: string, customerData: UpdateCustomerDtoResponse): Promise<CustomerDtoRequest> {
    const existingCustomer = await this.customerdb.findById(customerId);
    if (!existingCustomer) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    const updatedCustomer = {
      ...existingCustomer,
      ...customerData
    };

    const updatedCustomerDao = await this.customerdb.update(updatedCustomer);

    return {
      userId: updatedCustomerDao.userId,
      name: updatedCustomerDao.name,
      email: updatedCustomerDao.email,
      phone: updatedCustomerDao.phone,
      availableCredit: updatedCustomerDao.availableCredit,
      createdAt: updatedCustomerDao.createdAt
    };
  }
}
