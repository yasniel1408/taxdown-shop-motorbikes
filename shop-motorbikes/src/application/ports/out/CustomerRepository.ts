import { Customer } from '../../../domain/entities/Customer';

export interface CustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findById(userId: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  delete(userId: string): Promise<void>;
  update(customer: Customer): Promise<Customer>;
}
