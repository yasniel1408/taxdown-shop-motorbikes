import { Request, Response, NextFunction } from 'express';
import { CreateCustomerDtoResponse} from './dtos/request/CreateCustomerDtoResponse';
import { CustomerInputPort } from '../../../../domain/ports/in/CustomerInputPort';
import { CreateCustomerService } from '../../../../application/CreateCustomerService';
import { GetCustomerByIdService } from '../../../../application/GetCustomerByIdService';
import { UpdateCustomerService } from '../../../../application/UpdateCustomerService';
import { DeleteCustomerService } from '../../../../application/DeleteCustomerService';
import { AddCreditToCustomerService } from '../../../../application/AddCreditToCustomerService';
import { GetAllCustomersService } from '../../../../application/GetAllCustomersService';
import { inject, injectable } from "tsyringe";
import { AddCreditDtoResponse } from './dtos/request/AddCreditDtoResponse';
import { UpdateCustomerDtoRequest } from './dtos/request/UpdateCustomerDtoRequest';

@injectable()
export class CustomerHttpControllerAdapter implements CustomerInputPort<Request, Response, NextFunction> {
  constructor(
    @inject("CreateCustomerService") private readonly createCustomerService: CreateCustomerService,
    @inject("GetCustomerByIdService") private readonly getCustomerByIdService: GetCustomerByIdService,
    @inject("UpdateCustomerService") private readonly updateCustomerService: UpdateCustomerService,
    @inject("DeleteCustomerService") private readonly deleteCustomerService: DeleteCustomerService,
    @inject("AddCreditToCustomerService") private readonly addCreditToCustomerService: AddCreditToCustomerService,
    @inject("GetAllCustomersService") private readonly getAllCustomersService: GetAllCustomersService
  ) {}

  getHealth = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: "healthy", timestamp: new Date().toString() });
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
      const { userId } = req.params;
      const customer = await this.getCustomerByIdService.execute(userId);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  };

  updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const dto: UpdateCustomerDtoRequest = req.body;
      const customer = await this.updateCustomerService.execute(userId, dto);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  };

  deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      await this.deleteCustomerService.execute(userId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  addCredit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const dto: AddCreditDtoResponse = req.body;
      const customer = await this.addCreditToCustomerService.execute(userId, dto.amount);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  };

  getAllCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.query);
      const sortByCredit = req.query.sortByCredit === 'true';
      const customers = await this.getAllCustomersService.execute(sortByCredit);
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  };
}