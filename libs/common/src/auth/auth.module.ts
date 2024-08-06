import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { HelperModule } from '../helper/helper.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserSessionRepository } from '../modules/session/repositories/session.repository';
import { AuthService } from './services/auth.service';
import { UserRepository } from '../modules/user/repositories';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({}),
    HelperModule,
  ],
  providers: [
    JwtStrategy,
    RefreshTokenStrategy,
    UserSessionRepository,
    AuthService,
    UserRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
