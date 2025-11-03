import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
// import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

// Common modules
import { PrismaModule } from './common/prisma.module';
import { HealthController } from './common/health.controller';
import { AuthModule } from './modules/auth/auth.module';

// Business modules
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/inventory/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SetupModule } from './modules/setup/setup.module';
import { AIModule } from './modules/ai/ai.module';
import { WebflowModule } from './modules/webflow/webflow.module';
import { QueueModule } from './modules/queue/queue.module';
// import { SoftwareModule } from './modules/software/software.module';
// import { AnalyticsModule } from './modules/analytics/analytics.module';
// import { TasksService } from './common/tasks.service';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Rate limiting
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => [
                {
                    ttl: config.get<number>('THROTTLE_TTL', 60) * 1000,
                    limit: config.get<number>('THROTTLE_LIMIT', 10),
                },
            ],
        }),

        // Scheduled tasks
        // ScheduleModule.forRoot(),

        // GraphQL
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
                sortSchema: true,
                playground: true,
                introspection: true,
                context: ({ req, res }: { req: any; res: any }) => ({ req, res }),
                csrfPrevention: false,
            }),
        }),

        // Common modules
        PrismaModule,

        // Auth module (must be before business modules)
        AuthModule,

        // Business modules
        UsersModule,
        ProductsModule,
        SalesModule,
        PurchaseModule,
        AccountingModule,
        DashboardModule,
        SetupModule,
        AIModule,
        WebflowModule,
        QueueModule,
        // SoftwareModule,
        // AnalyticsModule,
    ],
    controllers: [HealthController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestIdMiddleware)
            .forRoutes('*');
    }
}