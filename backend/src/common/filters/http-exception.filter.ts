import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                message = (exceptionResponse as any).message || exception.message;
                error = (exceptionResponse as any).error || exception.name;
            }
        } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            status = HttpStatus.BAD_REQUEST;
            message = this.handlePrismaError(exception);
            error = 'Database Error';
        } else if (exception instanceof Prisma.PrismaClientValidationError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Invalid data provided';
            error = 'Validation Error';
        } else if (exception instanceof Error) {
            message = exception.message;
            error = exception.name;
        }

        // Log the error
        if (request && request.method && request.url) {
            this.logger.error(
                `${request.method} ${request.url} - ${status} - ${message}`,
                exception instanceof Error ? exception.stack : undefined,
                'HTTP_EXCEPTION',
            );
        } else {
            this.logger.error(
                `Error: ${message}`,
                exception instanceof Error ? exception.stack : undefined,
                'HTTP_EXCEPTION',
            );
        }

        // Don't expose internal errors in production
        if (process.env.NODE_ENV === 'production' && status === HttpStatus.INTERNAL_SERVER_ERROR) {
            message = 'Something went wrong';
        }

        if (response && response.status) {
            response.status(status).json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request?.url || 'unknown',
                method: request?.method || 'unknown',
                error,
                message,
                ...(process.env.NODE_ENV === 'development' && {
                    stack: exception instanceof Error ? exception.stack : undefined,
                }),
            });
        }
    }

    private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): string {
        switch (error.code) {
            case 'P2002':
                return 'A record with this information already exists';
            case 'P2025':
                return 'Record not found';
            case 'P2003':
                return 'Foreign key constraint failed';
            case 'P2014':
                return 'Invalid ID provided';
            default:
                return 'Database operation failed';
        }
    }
}
