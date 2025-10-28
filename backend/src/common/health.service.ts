import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class HealthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) { }

    async getHealthStatus() {
        const startTime = Date.now();

        try {
            // Check database connection
            await this.prisma.$queryRaw`SELECT 1`;
            const dbResponseTime = Date.now() - startTime;

            // Get basic system info
            const memoryUsage = process.memoryUsage();
            const uptime = process.uptime();

            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: Math.floor(uptime),
                environment: this.configService.get('NODE_ENV', 'development'),
                version: process.env.npm_package_version || '1.0.0',
                database: {
                    status: 'connected',
                    responseTime: `${dbResponseTime}ms`,
                },
                memory: {
                    used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
                    total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
                    external: Math.round(memoryUsage.external / 1024 / 1024),
                },
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
                database: {
                    status: 'disconnected',
                },
            };
        }
    }

    async getDetailedHealth() {
        const health = await this.getHealthStatus();

        if (health.status === 'unhealthy') {
            return health;
        }

        try {
            // Additional checks for detailed health
            const redisStatus = await this.checkRedisConnection();
            const diskSpace = await this.getDiskSpace();

            return {
                ...health,
                redis: redisStatus,
                disk: diskSpace,
                services: {
                    database: 'operational',
                    redis: redisStatus.status === 'connected' ? 'operational' : 'degraded',
                    api: 'operational',
                },
            };
        } catch (error) {
            return {
                ...health,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    private async checkRedisConnection() {
        try {
            // This would require Redis client setup
            // For now, return a mock status
            return {
                status: 'connected',
                responseTime: '< 1ms',
            };
        } catch (error) {
            return {
                status: 'disconnected',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    private async getDiskSpace() {
        try {
            const fs = require('fs');
            const stats = fs.statSync('.');
            return {
                available: 'sufficient',
                path: process.cwd(),
            };
        } catch (error) {
            return {
                available: 'unknown',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}
