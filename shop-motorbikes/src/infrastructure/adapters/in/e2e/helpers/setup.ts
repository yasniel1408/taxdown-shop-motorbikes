import { Application } from 'express';
import supertest from 'supertest';
import { CreateExpressApp } from '../../../../config/CreateExpressApp';
import { CustomerRouter } from '../../../../config/CustomerRouter';
import { container } from '../../../../config/container';
import { DynamoDBCustomerAdapter } from '../../../out/dynamodb/__mocks__/DynamoDBCustomerAdapter';

// Test API key for e2e tests
export const TEST_API_KEY = 'HBK7VLORR4JNNJJPI4K3PLPDLJVV4KQNSO5AEMVJF66Q9ASUAAJG';

export const setupTestApp = () => {
    // Register mock adapter
    container.registerSingleton('DynamoDBCustomerAdapter', DynamoDBCustomerAdapter);
    
    const expressApp = new CreateExpressApp([new CustomerRouter()]);
    const app: Application = expressApp.getApp();
    return supertest(app);
};

export const testCustomer = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    availableCredit: 1000
};
