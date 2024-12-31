import { inject, injectable } from 'tsyringe';
import { CustomerFactory } from '../domain/CustomerFactory';
import { DynamoDBCustomerAdapter } from '../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter';
import { CustomerDtoResponse } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoResponse';
import { CustomerNotFoundError } from '../domain/errors/CustomerNotFoundError';
import { CreditNotNegativeError } from '../domain/errors/CreditNotNegativeError';

@injectable()
export class AddCreditToCustomerService {
  constructor(
    @inject('DynamoDBCustomerAdapter')
    private readonly customerdb: DynamoDBCustomerAdapter
  ) {}

  async execute(customerId: string, amount: number): Promise<CustomerDtoResponse> {
    if (amount < 0) {
      throw new CreditNotNegativeError();
    }

    const customerDao = await this.customerdb.findById(customerId);
    if (!customerDao) {
      throw new CustomerNotFoundError();
    }

    const customerDomain = CustomerFactory.create(
      customerDao.name,
      customerDao.email,
      customerDao.phone,
      customerDao.availableCredit + amount
    );

    const customerUpdated = await this.customerdb.update({
      userId: customerDao.userId,
      name: customerDomain.name,
      email: customerDomain.email,
      phone: customerDomain.phone,
      availableCredit: customerDomain.availableCredit,
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
