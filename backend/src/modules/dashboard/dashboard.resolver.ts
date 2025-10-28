import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { DashboardMetrics, PerformancePoint, ModuleStatus } from './dto/metrics.dto';
import { ActivityFeed } from './dto/activity.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class DashboardResolver {
    constructor(private readonly dashboardService: DashboardService) { }

    @Query(() => DashboardMetrics, {
        name: 'dashboardMetrics',
        description: 'Obtener métricas principales del dashboard ejecutivo',
    })
    async getDashboardMetrics(): Promise<DashboardMetrics> {
        return this.dashboardService.getDashboardMetrics();
    }

    @Query(() => [PerformancePoint], {
        name: 'performanceData',
        description: 'Obtener datos de performance histórica',
    })
    async getPerformanceData(
        @Args('period', { type: () => String, nullable: true, defaultValue: 'year' })
        period?: string,
    ): Promise<PerformancePoint[]> {
        return this.dashboardService.getPerformanceData(period);
    }

    @Query(() => ActivityFeed, {
        name: 'recentActivities',
        description: 'Obtener feed de actividades recientes',
    })
    async getRecentActivities(
        @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
        limit?: number,
    ): Promise<ActivityFeed> {
        return this.dashboardService.getRecentActivities(limit);
    }

    @Query(() => [ModuleStatus], {
        name: 'moduleStatus',
        description: 'Obtener estado de los módulos del sistema',
    })
    async getModuleStatus(): Promise<ModuleStatus[]> {
        return this.dashboardService.getModuleStatus();
    }
}
