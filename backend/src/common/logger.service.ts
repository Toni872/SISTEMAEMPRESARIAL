import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger = console;

  log(message: string, context?: string) {
    this.logger.log(`[${new Date().toISOString()}] [${context || 'LOG'}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(`[${new Date().toISOString()}] [${context || 'ERROR'}] ${message}`);
    if (trace) {
      this.logger.error(trace);
    }
  }

  warn(message: string, context?: string) {
    this.logger.warn(`[${new Date().toISOString()}] [${context || 'WARN'}] ${message}`);
  }

  debug(message: string, context?: string) {
    this.logger.debug(`[${new Date().toISOString()}] [${context || 'DEBUG'}] ${message}`);
  }

  verbose(message: string, context?: string) {
    this.logger.log(`[${new Date().toISOString()}] [${context || 'VERBOSE'}] ${message}`);
  }
}
