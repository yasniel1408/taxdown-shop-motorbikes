import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { Request, Response } from 'express';
import { validateApiKey } from './validateApiKey';
import { errorHandler } from './errorHandler';

export class CreateExpressApp {
  private app: express.Application = express();

  constructor(routes: any[]) {
    // Middleware
    this.app.use(cors());
    this.app.use(express.json());
  
    // Rate limiting middleware
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    });
    this.app.use(limiter);
  
    // API Key validation middleware
    this.app.use(validateApiKey);
  
    // Routes
    routes.forEach((route) => {
      this.app.use(route);
    });
  
    // Error handling middleware
    this.app.use(errorHandler);
  
    // Handle 404
    this.app.use((req: Request, res: Response): void => {
      res.status(404).json({
        error: "Not Found",
        path: req.path
      });
    });
  }

  getApp() {
    return this.app;
  }
};
