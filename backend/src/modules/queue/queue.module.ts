import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { ReportProcessor } from './processors/report.processor';
import { NotificationProcessor } from './processors/notification.processor';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: 'reports' }, { name: 'notifications' }, { name: 'exports' }),
  ],
  controllers: [QueueController],
  providers: [ReportProcessor, NotificationProcessor, QueueService],
  exports: [BullModule, QueueService],
})
export class QueueModule {}
