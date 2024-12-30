import { Customer } from '../../../domain/entities/Customer';

export interface CreateCustomerCommand {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  initialCredit?: number;
}

export interface UpdateCustomerCommand {
  name: string;
  email: string;
  phone?: string;
  availableCredit?: number;
}

export interface AddCreditCommand {
  amount: number;
}

export interface CustomerUseCases {
  createCustomer(command: CreateCustomerCommand): Promise<Customer>;
  updateCustomer(userId: string, command: UpdateCustomerCommand): Promise<Customer>;
  deleteCustomer(userId: string): Promise<void>;
  getCustomer(userId: string): Promise<Customer>;
  getAllCustomers(): Promise<Customer[]>;
  addCredit(userId: string, command: AddCreditCommand): Promise<Customer>;
}
