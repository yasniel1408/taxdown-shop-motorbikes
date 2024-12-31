import express from 'express';
import { CustomerHttpControllerAdapter } from '../adapters/in/http/CustomerHttpControllerAdapter';
import { CreateCustomerService } from '../../application/CreateCustomerService';
import { GetCustomerByIdService } from '../../application/GetCustomerByIdService';
import { UpdateCustomerService } from '../../application/UpdateCustomerService';
import { DeleteCustomerService } from '../../application/DeleteCustomerService';
import { AddCreditToCustomerService } from '../../application/AddCreditToCustomerService';
import { GetAllCustomersService } from '../../application/GetAllCustomersService';
import { DynamoDBCustomerAdapter } from '../adapters/out/dynamodb/DynamoDBCustomerAdapter';
import { Router } from 'express';
import { BaseRouter } from './base/BaseRouter';

export class CustomerRouter extends BaseRouter {
    private customerController = new CustomerHttpControllerAdapter(
        new CreateCustomerService(new DynamoDBCustomerAdapter()),
        new GetCustomerByIdService(new DynamoDBCustomerAdapter()),
        new UpdateCustomerService(new DynamoDBCustomerAdapter()),
        new DeleteCustomerService(new DynamoDBCustomerAdapter()),
        new AddCreditToCustomerService(new DynamoDBCustomerAdapter()),
        new GetAllCustomersService(new DynamoDBCustomerAdapter())
    );

    constructor() {
        super();
    }

    protected configureRoutes(): Router {
        const router = Router();

        router.get('/health', this.customerController.getHealth);
        
        router.route('/customers')
            .get(this.customerController.getAllCustomers)
            .post(this.customerController.createCustomer);

        router.route('/customers/:userId')
            .get(this.customerController.getCustomerById)
            .put(this.customerController.updateCustomer)
            .delete(this.customerController.deleteCustomer);

        router.post('/customers/:userId/credit', this.customerController.addCredit);

        return router;
    }

    public getRouter(): Router {
        return this.configureRoutes();
    }
}