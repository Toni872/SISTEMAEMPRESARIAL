import { ConfigService } from '@nestjs/config';

export const databaseConfig = {
  provide: 'DATABASE_CONFIG',
  useFactory: (configService: ConfigService) => ({
    url: configService.get<string>('DATABASE_URL'),
    type: 'postgresql',
  }),
  inject: [ConfigService],
};
