import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueueService, ReportJob, NotificationJob } from './queue.service';

@ApiTags('Queue')
@Controller('queue')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get queue status and statistics' })
  async getQueueStatus() {
    return this.queueService.getQueueStatus();
  }

  @Post('reports')
  @ApiOperation({ summary: 'Queue a report generation job' })
  async queueReport(@Body() job: ReportJob) {
    const queuedJob = await this.queueService.addReportJob(job);
    return {
      message: 'Report job queued successfully',
      jobId: queuedJob.id,
    };
  }

  @Post('notifications')
  @ApiOperation({ summary: 'Queue a notification job' })
  async queueNotification(@Body() job: NotificationJob) {
    const queuedJob = await this.queueService.addNotificationJob(job);
    return {
      message: 'Notification job queued successfully',
      jobId: queuedJob.id,
    };
  }

  @Post('exports')
  @ApiOperation({ summary: 'Queue an export job' })
  async queueExport(@Body() job: { type: 'excel' | 'csv'; filename: string; data: any; userId: number }) {
    const queuedJob = await this.queueService.addExportJob(job);
    return {
      message: 'Export job queued successfully',
      jobId: queuedJob.id,
    };
  }

  @Post('clean/:queueName')
  @ApiOperation({ summary: 'Clean completed/failed jobs from a queue' })
  async cleanQueue(@Body('queueName') queueName: 'reports' | 'notifications' | 'exports') {
    await this.queueService.cleanQueue(queueName);
    return {
      message: `Queue ${queueName} cleaned successfully`,
    };
  }
}

