import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserSessionRepository } from '../../../src/modules/session/repositories/session.repository';
import { AuthInterface } from '../interfaces/auth.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly sessionRepository: UserSessionRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: AuthInterface) {
    const validateUser = await this.sessionRepository.findOne({
      where: {
        uuid: payload.sessionId,
        isLoggedOut: false,
      },
    });
    if (validateUser) {
      return {
        email: payload.email,
        userUuid: payload.uuid,
        uuid: payload.uuid,
        sessionId: payload.sessionId,
      };
    } else {
      throw new BadRequestException('Unauthorized');
    }
  }
}
