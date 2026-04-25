import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { ZodValidationPipe } from 'nestjs-zod';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  console.log(env.FRONTEND_API);

  app.enableCors({
    origin: env.FRONTEND_API,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
