import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { EnvironmentConfigService } from './environment-config/environment-config.service';
import { DatabaseConfigService } from './database-config/database-config.service';
import { environmentConfigSchema } from './environment-config/environment-config.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: (env: Record<string, unknown>) => environmentConfigSchema.parse(env),
    }),
  ],
  providers: [EnvironmentConfigService, DatabaseConfigService],
  exports: [EnvironmentConfigService, DatabaseConfigService],
})
export class ConfigurationModule {}
