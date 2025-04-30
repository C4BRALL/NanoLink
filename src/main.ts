import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigService } from './infrastructure/documentation/swagger/swagger-config/swagger-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerService = app.get(SwaggerConfigService);

  swaggerService.setup(app);

  await app.listen(process.env.API_PORT ?? 3000).then(() => {
    console.table({
      url: `http://localhost:${process.env.API_PORT ?? 3000}`,
    });
  });
}
bootstrap();
