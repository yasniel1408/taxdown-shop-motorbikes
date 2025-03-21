import 'reflect-metadata';
import './infrastructure/config/container';
import serverless from 'serverless-http';
import { CreateExpressApp } from './infrastructure/config/CreateExpressApp';
import { CustomerRouter } from './infrastructure/config/CustomerRouter';

// Initialize Express app with routers
const expressApp = new CreateExpressApp([new CustomerRouter()]);
const app = expressApp.getApp();

// Export the serverless handler
export const handler = serverless(app, {
    provider: 'aws'
});