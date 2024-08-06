import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app.module';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { setupSwaggerAuthentication } from '../libs/common/src/util/user-auth.swagger.utils';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.enableCors();

  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000,
      max: 500,
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  setupSwaggerAuthentication(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Auto-transform payloads to their DTO instances.
      transformOptions: {
        enableImplicitConversion: true, // Convert incoming payloads to their DTO instances if possible.
      },
    }),
  );

  await app.listen(process.env.PORT || 4000);
}
console.log('Starting auth at port ...', process.env.PORT || 4000);
bootstrap();
