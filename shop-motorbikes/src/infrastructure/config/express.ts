import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { CustomerController } from '../adapters/in/api/CustomerController';
import { Request, Response, NextFunction } from 'express';

export const createExpressApp = (customerController: CustomerController) => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API Key validation middleware
  const validateApiKey = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      res.status(401).json({ error: 'API Key is required' });
      return;
    }
    next();
  };

  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });

  app.use(limiter);
  app.use(validateApiKey);

  // Routes
  app.get('/api/health', customerController.getHealth);
  app.get('/api/customers', customerController.getAllCustomers);
  app.get('/api/customers/:userId', customerController.getCustomer);
  app.post('/api/customers', customerController.createCustomer);
  app.put('/api/customers/:userId', customerController.updateCustomer);
  app.delete('/api/customers/:userId', customerController.deleteCustomer);
  app.post('/api/customers/:userId/credit', customerController.addCredit);

  // Error handling middleware
  const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };

  app.use(errorHandler);

  // Handle 404
  app.use((req: Request, res: Response): void => {
    res.status(404).json({
      error: "Not Found",
      path: req.path
    });
  });

  return app;
};
