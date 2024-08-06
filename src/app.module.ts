import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { AuthenticationModule } from './auth/auth.module';
import { UserAuthController } from './auth/controllers/user-auth.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
    }),
    AuthenticationModule,
  ],
  controllers: [UserAuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AuthModule {}
