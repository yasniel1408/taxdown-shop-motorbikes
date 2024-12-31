export interface CustomerInputPort<Rq, Rs, Nf> {
  createCustomer(req: Rq, res: Rs, next: Nf): Promise<void>;
  getCustomerById(req: Rq, res: Rs, next: Nf): Promise<void>;
  updateCustomer(req: Rq, res: Rs, next: Nf): Promise<void>;
  addCredit(req: Rq, res: Rs, next: Nf): Promise<void>;
  getAllCustomers(req: Rq, res: Rs, next: Nf): Promise<void>;
  deleteCustomer(req: Rq, res: Rs, next: Nf): Promise<void>;
}
