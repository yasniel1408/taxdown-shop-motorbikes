import serverless from 'serverless-http';
import { CreateExpressApp } from './infrastructure/config/CreateExpressApp';
import { CustomerRouter } from './infrastructure/config/CustomerRouter';

// Initialize Customer Routers
const customerRouter = new CustomerRouter();

// Create Express app with routers
const expressApp = new CreateExpressApp([customerRouter]);
const app = expressApp.getApp();

// Export the serverless handler
export const handler = serverless(app);
