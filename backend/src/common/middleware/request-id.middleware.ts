import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        const requestId = req.headers['x-request-id'] as string || this.generateId();

        // Add request ID to request object
        (req as any).requestId = requestId;

        // Add request ID to response headers
        res.setHeader('x-request-id', requestId);

        // Add request ID to response locals for logging
        res.locals.requestId = requestId;

        next();
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
