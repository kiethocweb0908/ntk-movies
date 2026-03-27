import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: env.FRONTEND_API, // Port của Next.js
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });

  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
