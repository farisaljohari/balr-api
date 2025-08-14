import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from '../../../libs/common/src/auth/services/auth.service';
import { OtpType } from '../../../libs/common/src/constants/otp-type.enum';
import { HelperHashService } from '../../../libs/common/src/helper/services';
import { UserSessionRepository } from '../../../libs/common/src/modules/session/repositories/session.repository';
import { UserOtpRepository } from '../../../libs/common/src/modules/user-otp/repositories/user-otp.repository';
import { UserEntity } from '../../../libs/common/src/modules/user/entities/user.entity';
import { UserRepository } from '../../../libs/common/src/modules/user/repositories';
import { EmailService } from '../../../libs/common/src/util/email.service';
import { ForgetPasswordDto, UserOtpDto, VerifyOtpDto } from '../dtos';
import { UserSignUpDto } from '../dtos/user-auth.dto';
import { UserLoginDto } from '../dtos/user-login.dto';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: UserSessionRepository,
    private readonly otpRepository: UserOtpRepository,
    private readonly helperHashService: HelperHashService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const findUser = await this.findUser(userSignUpDto.email);
    if (findUser) {
      throw new BadRequestException('User already registered with given email');
    }

    if (!userSignUpDto.policyAgreement) {
      throw new BadRequestException('You must accept the policy to register');
    }

    const salt = this.helperHashService.randomSalt(10);
    const hashedPassword = await this.helperHashService.bcrypt(
      userSignUpDto.password,
      salt,
    );

    try {
      const user = await this.userRepository.save({
        email: userSignUpDto.email,
        password: hashedPassword,
        fullName: userSignUpDto.fullName,
        dateOfBirth: userSignUpDto.dateOfBirth,
        position: userSignUpDto.position,
        policyAgreement: userSignUpDto.policyAgreement, // must be true
      });

      return user; // controller will shape the response
    } catch (error) {
      throw new BadRequestException('Failed to register user');
    }
  }

  async findUser(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const findUser = await this.findUser(forgetPasswordDto.email);
    if (!findUser) {
      throw new BadRequestException('User not found');
    }
    const salt = this.helperHashService.randomSalt(10);
    const password = this.helperHashService.bcrypt(
      forgetPasswordDto.password,
      salt,
    );
    return await this.userRepository.update(
      { uuid: findUser.uuid },
      { password },
    );
  }

  async userLogin(data: UserLoginDto) {
    const user = await this.authService.validateUser(data.email, data.password);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials.');
    }

    const session = await Promise.all([
      await this.sessionRepository.update(
        { userId: user.id },
        {
          isLoggedOut: true,
        },
      ),
      await this.authService.createSession({
        userId: user.uuid,
        loginTime: new Date(),
        isLoggedOut: false,
      }),
    ]);

    return await this.authService.login({
      email: user.email,
      userId: user.uuid,
      uuid: user.uuid,

      sessionId: session[1].uuid,
    });
  }

  async deleteUser(uuid: string) {
    const user = await this.findOneById(uuid);
    if (!user) {
      throw new BadRequestException('User does not found');
    }
    return await this.userRepository.update({ uuid }, { isActive: false });
  }

  async findOneById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { uuid: id } });
  }

  async generateOTP(data: UserOtpDto): Promise<string> {
    await this.otpRepository.delete({ email: data.email, type: data.type });
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 3);
    await this.otpRepository.save({
      email: data.email,
      otpCode,
      expiryTime,
      type: data.type,
    });
    const subject = 'OTP send successfully';
    const message = `Your OTP code is ${otpCode}`;
    this.emailService.sendOTPEmail(data.email, subject, message);
    return otpCode;
  }

  async verifyOTP(data: VerifyOtpDto): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: { email: data.email, type: data.type },
    });

    if (!otp) {
      throw new BadRequestException('this email is not registered');
    }

    if (otp.otpCode !== data.otpCode) {
      throw new BadRequestException('You entered wrong OTP');
    }

    if (otp.expiryTime < new Date()) {
      await this.otpRepository.delete(otp.uuid);
      throw new BadRequestException('OTP expired');
    }

    if (data.type == OtpType.VERIFICATION) {
      await this.userRepository.update(
        { email: data.email },
        { isUserVerified: true },
      );
    }

    return true;
  }

  async userList(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      where: { isActive: true },
      select: {
        fullName: true,
        email: true,
        isActive: true,
      },
    });
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
    type: string,
    sessionId: string,
  ) {
    const user = await this.userRepository.findOne({ where: { uuid: userId } });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.authService.getTokens({
      email: user.email,
      userId: user.uuid,
      uuid: user.uuid,
      type,
      sessionId,
    });
    await this.authService.updateRefreshToken(user.uuid, tokens.refreshToken);
    return tokens;
  }
}
