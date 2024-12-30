import { Request, Response, NextFunction } from 'express';
import { CustomerUseCases } from '../../../../domain/ports/in/CustomerUseCases';

export class CustomerController {
  constructor(private readonly customerService: CustomerUseCases) {}

  getHealth = async (req: Request, res: Response): Promise<void> => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  };

  createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer = await this.customerService.createCustomer({
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        initialCredit: req.body.availableCredit
      });
      res.json(customer.toJSON());
    } catch (error) {
      next(error);
    }
  };

  updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer = await this.customerService.updateCustomer(req.params.userId, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        availableCredit: req.body.availableCredit
      });
      res.json(customer.toJSON());
    } catch (error) {
      next(error);
    }
  };

  deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.customerService.deleteCustomer(req.params.userId);
      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  getCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer = await this.customerService.getCustomer(req.params.userId);
      res.json(customer.toJSON());
    } catch (error) {
      next(error);
    }
  };

  getAllCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customers = await this.customerService.getAllCustomers();
      res.json(customers.map(customer => customer.toJSON()));
    } catch (error) {
      next(error);
    }
  };

  addCredit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer = await this.customerService.addCredit(req.params.userId, {
        amount: req.body.amount
      });
      res.json(customer.toJSON());
    } catch (error) {
      next(error);
    }
  };
}
