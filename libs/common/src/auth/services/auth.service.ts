import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { HelperHashService } from '../../helper/services';
import { UserRepository } from '../../../../common/src/modules/user/repositories';
import { UserSessionRepository } from '../../../../common/src/modules/session/repositories/session.repository';
import { UserSessionEntity } from '../../../../common/src/modules/session/entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: UserSessionRepository,
    private readonly helperHashService: HelperHashService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      const passwordMatch = this.helperHashService.bcryptCompare(
        pass,
        user.password,
      );

      if (!user.isUserVerified && passwordMatch) {
        throw new BadRequestException('User is not verified');
      } else if (passwordMatch) {
        const { ...result } = user;
        return result;
      }
    }
    return null;
  }

  async createSession(data): Promise<UserSessionEntity> {
    return await this.sessionRepository.save(data);
  }

  async getTokens(payload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '24h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      userId: user.userId,
      uuid: user.uuid,
      type: user.type,
      sessionId: user.sessionId,
    };

    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(user.uuid, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userRepository.update(
      { uuid: userId },
      {
        refreshToken: hashedRefreshToken,
      },
    );
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
