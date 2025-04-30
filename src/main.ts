import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.API_PORT ?? 3000).then(() => {
    console.table({
      url: `http://localhost:${process.env.API_PORT ?? 3000}`,
    });
  });
}
bootstrap();
