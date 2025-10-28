import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LoggerService } from './logger.service';
import { HealthService } from './health.service';

@Global()
@Module({
    providers: [PrismaService, LoggerService, HealthService],
    exports: [PrismaService, LoggerService, HealthService],
})
export class PrismaModule { }