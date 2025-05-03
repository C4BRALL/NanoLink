import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';
import { ConfigurationModule } from '../config/config.module';

@Global()
@Module({
  imports: [ConfigurationModule],
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class LoggerModule {}
