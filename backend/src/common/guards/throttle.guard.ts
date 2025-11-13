import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    // Use IP address as the primary tracker
    // In production, you might want to use user ID for authenticated requests
    return req.ip || req.connection.remoteAddress || 'unknown';
  }

  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = this.generateKey(context, await this.getTracker(request), 'default');

    const totalHits = await this.storageService.increment(key, ttl);

    if (totalHits.totalHits > limit) {
      throw new Error('Rate limit exceeded');
    }

    return true;
  }
}
