import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AIService } from './ai.service';
import { AIResolver } from './ai.resolver';
import { AIGateway } from './ai.gateway';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AIService, AIResolver, AIGateway],
  exports: [AIService],
})
export class AIModule {}
