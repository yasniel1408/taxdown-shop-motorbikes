import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../../domain/errors/BaseError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);

    if (err instanceof BaseError) {
        const error = err as BaseError;
        res.status(error.status).json({
            error: error.name,
            message: error.message
        });
        return;
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
};