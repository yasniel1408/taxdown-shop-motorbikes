import { CustomerDtoRequest } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoRequest';
import { UpdateCustomerDtoResponse } from '../infrastructure/adapters/in/http/dtos/request/UpdateCustomerDtoResponse';
import { inject } from 'tsyringe';
import { CustomerDatabasePort } from '../domain/ports/out/CustomerDatabasePort';
import { CustomerDao } from '../infrastructure/adapters/out/dynamodb/dao/CustomerDao';

export class UpdateCustomerService {
  constructor(
    @inject("CustomerDatabasePort")
    private readonly customerdb: CustomerDatabasePort<CustomerDao>
) {}

  async execute(customerId: string, customerData: UpdateCustomerDtoResponse): Promise<CustomerDtoRequest> {
    const existingCustomer = await this.customerdb.findById(customerId);
    if (!existingCustomer) {
      throw new Error('Customer not found');
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
      createdAt: updatedCustomerDao.createdAt.toISOString()
    };
  }
}
