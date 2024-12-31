import express from 'express';
import { CustomerHttpControllerAdapter } from '../adapters/in/http/CustomerHttpControllerAdapter';
import { CreateCustomerService } from '../../application/CreateCustomerService';
import { GetCustomerByIdService } from '../../application/GetCustomerByIdService';
import { UpdateCustomerService } from '../../application/UpdateCustomerService';
import { DeleteCustomerService } from '../../application/DeleteCustomerService';
import { AddCreditToCustomerService } from '../../application/AddCreditToCustomerService';
import { GetAllCustomersService } from '../../application/GetAllCustomersService';
import { DynamoDBCustomerAdapter } from '../adapters/out/dynamodb/DynamoDBCustomerAdapter';

export class CustomerRouter {
    private customerController = new CustomerHttpControllerAdapter(
        new CreateCustomerService(new DynamoDBCustomerAdapter()),
        new GetCustomerByIdService(new DynamoDBCustomerAdapter()),
        new UpdateCustomerService(new DynamoDBCustomerAdapter()),
        new DeleteCustomerService(new DynamoDBCustomerAdapter()),
        new AddCreditToCustomerService(new DynamoDBCustomerAdapter()),
        new GetAllCustomersService(new DynamoDBCustomerAdapter())
    );
    
    constructor(app: express.Application) {
        app.get('/api/health', this.customerController.getHealth);
        app.get('/api/customers', this.customerController.getAllCustomers);
        app.get('/api/customers/:userId', this.customerController.getAllCustomers);
        app.post('/api/customers', this.customerController.createCustomer);
        app.put('/api/customers/:userId', this.customerController.updateCustomer);
        app.delete('/api/customers/:userId', this.customerController.deleteCustomer);
        app.post('/api/customers/:userId/credit', this.customerController.addCredit);
    }
}