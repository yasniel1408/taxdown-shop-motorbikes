import { inject, injectable } from 'tsyringe';
import { DynamoDBCustomerAdapter } from '../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter';
import { UpdateCustomerDtoRequest } from '../infrastructure/adapters/in/http/dtos/request/UpdateCustomerDtoRequest';
import { CustomerDtoResponse } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoResponse';
import { CustomerNotFoundError } from '../domain/errors/CustomerNotFoundError';

@injectable()
export class UpdateCustomerService {
  constructor(
    @inject("DynamoDBCustomerAdapter")
    private readonly customerdb: DynamoDBCustomerAdapter
) {}

  async execute(customerId: string, customerData: UpdateCustomerDtoRequest): Promise<CustomerDtoResponse> {
    const existingCustomer = await this.customerdb.findById(customerId);
    if (!existingCustomer) {
      throw new CustomerNotFoundError();
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
