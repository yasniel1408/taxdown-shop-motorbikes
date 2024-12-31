import { injectable } from 'tsyringe';
import { CustomerDatabasePort } from '../../../../../domain/ports/out/CustomerDatabasePort';
import { CustomerDao } from '../dao/CustomerDao';
import { CustomerNotFoundError } from '../../../../../domain/errors/CustomerNotFoundError';

@injectable()
export class DynamoDBCustomerAdapter implements CustomerDatabasePort<CustomerDao> {
  private customers: Map<string, CustomerDao> = new Map();

  async save(customer: CustomerDao): Promise<CustomerDao> {
    this.customers.set(customer.userId, customer);
    return customer;
  }

  async findById(userId: string): Promise<CustomerDao> {
    const customer = this.customers.get(userId);
    if (!customer) {
      throw new CustomerNotFoundError();
    }
    return customer;
  }

  async findAll(): Promise<CustomerDao[]> {
    return Array.from(this.customers.values());
  }

  async update(customer: CustomerDao): Promise<CustomerDao> {
    const existingCustomer = await this.findById(customer.userId);
    if (!existingCustomer) {
      throw new CustomerNotFoundError();
    }
    this.customers.set(customer.userId, {
      ...existingCustomer,
      ...customer
    });
    return this.customers.get(customer.userId)!;
  }

  async delete(userId: string): Promise<void> {
    if (!this.customers.has(userId)) {
      throw new CustomerNotFoundError();
    }
    this.customers.delete(userId);
  }

  async findAllSortedByCredit(): Promise<CustomerDao[]> {
    return Array.from(this.customers.values())
      .sort((a, b) => b.availableCredit - a.availableCredit);
  }
}
