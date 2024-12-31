import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);

    // if error status is 404
    if (err.message === 'CUSTOMER_NOT_FOUND') {
        res.status(404).json({
            error: 'Not Found',
            message: "Customer not found"
        });
        return;
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
};