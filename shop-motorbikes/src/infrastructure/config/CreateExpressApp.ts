import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { validateApiKey } from './validateApiKey';
import { errorHandler } from './errorHandler';
import { BaseRouter } from './base/BaseRouter';
import rateLimit from 'express-rate-limit';

export class CreateExpressApp {
    private readonly app: Application;

    constructor(routers: BaseRouter[]) {
        this.app = express();
        this.configureMiddleware();
        this.configureRouters(routers);
        this.configureErrorHandling();
        this.handle404();
    }

    private configureMiddleware(): void {
        // Security middleware
        this.app.use(helmet());
        this.app.use(cors());

        // Rate limiting middleware
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        });
        this.app.use(limiter);
        
        // API Key validation
        this.app.use(validateApiKey);
        
        // Body parsing middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private configureRouters(routers: BaseRouter[]): void {
        routers.forEach(router => {
            this.app.use('/api', router.getRouter());
        });
    }

    private configureErrorHandling(): void {
        this.app.use(errorHandler);
    }

    private handle404(): void {
        this.app.use((req: express.Request, res: express.Response): void => {
            res.status(404).json({
                error: "Not Found",
                path: req.path
            });
        });
    }

    public getApp(): Application {
        return this.app;
    }
}
