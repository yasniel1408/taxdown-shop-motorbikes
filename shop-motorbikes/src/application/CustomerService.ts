import { Customer } from '../domain/entities/Customer';
import { CustomerRepository } from '../domain/ports/out/CustomerRepository';
import { CustomerUseCases, CreateCustomerCommand, UpdateCustomerCommand, AddCreditCommand } from '../domain/ports/in/CustomerUseCases';

export class CustomerService implements CustomerUseCases {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async createCustomer(command: CreateCustomerCommand): Promise<Customer> {
    const customer = Customer.create(
      command.userId,
      command.name,
      command.email,
      command.phone,
      command.initialCredit
    );

    return this.customerRepository.save(customer);
  }

  async updateCustomer(userId: string, command: UpdateCustomerCommand): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findById(userId);
    if (!existingCustomer) {
      throw new Error(`Customer with ID ${userId} not found`);
    }

    const updatedCustomer = Customer.create(
      userId,
      command.name,
      command.email,
      command.phone,
      command.availableCredit ?? existingCustomer.credit
    );

    return this.customerRepository.update(updatedCustomer);
  }

  async deleteCustomer(userId: string): Promise<void> {
    await this.customerRepository.delete(userId);
  }

  async getCustomer(userId: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(userId);
    if (!customer) {
      throw new Error(`Customer with ID ${userId} not found`);
    }
    return customer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async addCredit(userId: string, command: AddCreditCommand): Promise<Customer> {
    const customer = await this.getCustomer(userId);
    customer.addCredit(command.amount);
    return this.customerRepository.update(customer);
  }
}
