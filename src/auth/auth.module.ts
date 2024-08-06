import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { ConfigModule } from '@nestjs/config';
import { UserRepositoryModule } from '../../libs/common/src/modules/user/user.repository.module';
import { CommonModule } from '../../libs/common/src';
import { UserAuthController } from './controllers';
import { UserAuthService } from './services';
import { UserRepository } from '../../libs/common/src/modules/user/repositories';
import { UserSessionRepository } from '../../libs/common/src/modules/session/repositories/session.repository';
import { UserOtpRepository } from '../../libs/common/src/modules/user-otp/repositories/user-otp.repository';

@Module({
  imports: [ConfigModule, UserRepositoryModule, CommonModule],
  controllers: [UserAuthController],
  providers: [
    AuthenticationService,
    UserAuthService,
    UserRepository,
    UserSessionRepository,
    UserOtpRepository,
  ],
  exports: [AuthenticationService, UserAuthService],
})
export class AuthenticationModule {}
