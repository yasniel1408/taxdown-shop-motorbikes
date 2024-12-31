import { inject, injectable } from 'tsyringe';
import { CustomerFactory } from '../domain/CustomerFactory';
import { CustomerDtoRequest } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoRequest';
import { DynamoDBCustomerAdapter } from '../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter';

@injectable()
export class AddCreditToCustomerService {
  constructor(
    @inject("DynamoDBCustomerAdapter")
    private readonly customerdb: DynamoDBCustomerAdapter
) {}

  async execute(customerId: string, amount: number): Promise<CustomerDtoRequest> {
    const customerDao = await this.customerdb.findById(customerId);
    if (!customerDao) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    const customerDomain = CustomerFactory.create(
      customerDao.name,
      customerDao.email,
      customerDao.phone,
      customerDao.availableCredit
    );
    customerDomain.addCredit(amount);
    customerDomain.id = customerDao.userId;

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
      createdAt: customerUpdated.createdAt
    };
  }
}
