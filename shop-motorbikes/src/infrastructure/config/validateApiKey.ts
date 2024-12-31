import { Request, Response, NextFunction } from 'express';

export const validateApiKey = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      res.status(401).json({ error: 'API Key is required' });
      return;
    }
    next();
};