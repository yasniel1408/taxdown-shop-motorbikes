export interface CustomerDatabasePort<C> {
  save(customer: C): Promise<C>;
  findById(userId: string): Promise<C>;
  findAll(): Promise<C[]>;
  delete(userId: string): Promise<void>;
  update(customer: C): Promise<C>;
}
