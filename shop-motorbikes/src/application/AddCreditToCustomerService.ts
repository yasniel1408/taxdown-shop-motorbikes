import { inject } from 'tsyringe';
import { CustomerFactory } from '../domain/CustomerFactory';
import { CustomerDtoRequest } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoRequest';
import { CustomerDatabasePort } from '../domain/ports/out/CustomerDatabasePort';
import { CustomerDao } from '../infrastructure/adapters/out/dynamodb/dao/CustomerDao';

export class AddCreditToCustomerService {
  constructor(
    @inject("CustomerDatabasePort")
    private readonly customerdb: CustomerDatabasePort<CustomerDao>
) {}

  async execute(customerId: string, amount: number): Promise<CustomerDtoRequest> {
    const customerDao = await this.customerdb.findById(customerId);
    if (!customerDao) {
      throw new Error('Customer not found');
    }

    const customerDomain = CustomerFactory.create(
      customerDao.name,
      customerDao.email,
      customerDao.phone,
      customerDao.availableCredit
    );
    customerDomain.addCredit(amount);

    const customerUpdated = await this.customerdb.update({
      userId: customerDomain.id,
      name: customerDomain.name,
      email: customerDomain.email,
      phone: customerDomain.phone,
      availableCredit: customerDomain.credit,
      createdAt: customerDomain.createdAt
    });

    return {
      userId: customerUpdated.userId,
      name: customerUpdated.name,
      email: customerUpdated.email,
      phone: customerUpdated.phone,
      availableCredit: customerUpdated.availableCredit,
      createdAt: customerUpdated.createdAt.toISOString()
    };
  }
}
