import serverless from 'serverless-http';
import { createExpressApp } from './infrastructure/config/express';
import { CustomerController } from './infrastructure/adapters/in/api/CustomerController';
import { CustomerService } from './application/CustomerService';
import { DynamoDBCustomerRepository } from './infrastructure/adapters/out/persistence/DynamoDBCustomerRepository';

// Dependency injection
const customerRepository = new DynamoDBCustomerRepository();
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

// Create Express app with injected dependencies
const app = createExpressApp(customerController);

// Export the serverless handler
export const handler = serverless(app);
