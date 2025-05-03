import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigService } from './infrastructure/documentation/swagger/swagger-config/swagger-config.service';
import { EnvironmentConfigService } from './infrastructure/config/environment-config/environment-config.service';
import { HttpExceptionFilter } from './interface/error-handling/http-exception.filter';
import { LoggingInterceptor } from './interface/interceptors/logger.interceptor';
import { WinstonLoggerService } from './infrastructure/logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.get(WinstonLoggerService);

  const environmentConfigService = app.get(EnvironmentConfigService);

  const swaggerService = app.get(SwaggerConfigService);

  swaggerService.setup(app);

  await app.listen(environmentConfigService.get('API_PORT') ?? 3000).then(() => {
    console.table({
      url: `http://localhost:${environmentConfigService.get('API_PORT') ?? 3000}`,
      swagger: `http://localhost:${environmentConfigService.get('API_PORT') ?? 3000}/api/docs`,
    });
  });
}
bootstrap();
