import { Router } from 'express';

export abstract class BaseRouter {
    protected abstract configureRoutes(): Router;
    public abstract getRouter(): Router;
}
