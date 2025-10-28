import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { PrismaModule } from '../../common/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [DashboardService, DashboardResolver],
    exports: [DashboardService],
})
export class DashboardModule { }
