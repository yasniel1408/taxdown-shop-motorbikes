import { Request, Response, NextFunction } from 'express';
import { CreateCustomerDtoResponse} from './dtos/request/CreateCustomerDtoResponse';
import { CustomerInputPort } from '../../../../domain/ports/in/CustomerInputPort';
import { UpdateCustomerDtoResponse } from './dtos/request/UpdateCustomerDtoResponse';
import { AddCreditDtoResponse } from './dtos/request/AddCreditDtoResponse';
import { CreateCustomerService } from '../../../../application/CreateCustomerService';
import { GetCustomerByIdService } from '../../../../application/GetCustomerByIdService';
import { UpdateCustomerService } from '../../../../application/UpdateCustomerService';
import { DeleteCustomerService } from '../../../../application/DeleteCustomerService';
import { AddCreditToCustomerService } from '../../../../application/AddCreditToCustomerService';
import { GetAllCustomersService } from '../../../../application/GetAllCustomersService';

export class CustomerHttpControllerAdapter implements CustomerInputPort<Request, Response, NextFunction> {
  constructor(
    private readonly createCustomerService: CreateCustomerService,
    private readonly getCustomerByIdService: GetCustomerByIdService,
    private readonly updateCustomerService: UpdateCustomerService,
    private readonly deleteCustomerService: DeleteCustomerService,
    private readonly addCreditService: AddCreditToCustomerService,
    private readonly getAllCustomersService: GetAllCustomersService
  ) {}

  getHealth = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
  };

  createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateCustomerDtoResponse = req.body;
      const customer = await this.createCustomerService.execute(dto);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  };

  getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const customer = await this.getCustomerByIdService.execute(id);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  };

  updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateCustomerDtoResponse = req.body;
      const customer = await this.updateCustomerService.execute(id, dto);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  };

  deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deleteCustomerService.execute(id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  addCredit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: AddCreditDtoResponse = req.body;
      const customer = await this.addCreditService.execute(id, dto.amount);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  };

  getAllCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customers = await this.getAllCustomersService.execute();
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  };
}
