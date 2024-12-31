import serverless from 'serverless-http';
import { CreateExpressApp } from './infrastructure/config/CreateExpressApp';
import { CustomerRouter } from './infrastructure/config/CustomerRouter';

// Create Express app with injected dependencies
const expressApp = new CreateExpressApp([CustomerRouter]);
const app = expressApp.getApp();

// Export the serverless handler
export const handler = serverless(app);
