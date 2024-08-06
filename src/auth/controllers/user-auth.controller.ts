import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserAuthService } from '../services/user-auth.service';
import { UserSignUpDto } from '../dtos/user-auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../../libs/common/src/response/response.decorator';
import { UserLoginDto } from '../dtos/user-login.dto';
import { ForgetPasswordDto, UserOtpDto, VerifyOtpDto } from '../dtos';
import { RefreshTokenGuard } from '@app/common/guards/jwt-refresh.auth.guard';
import { JwtAuthGuard } from '@app/common/guards/jwt.auth.guard';

@Controller({
  version: '1',
  path: 'authentication',
})
@ApiTags('Auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @ResponseMessage('User Registered Successfully')
  @Post('user/signup')
  async signUp(@Body() userSignUpDto: UserSignUpDto) {
    const signupUser = await this.userAuthService.signUp(userSignUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: {
        id: signupUser.uuid,
        default: () => 'gen_random_uuid()', // this is a default value for the uuid column
      },
      message: 'User Registered Successfully',
    };
  }

  @ResponseMessage('user logged in successfully')
  @Post('user/login')
  async userLogin(@Body() data: UserLoginDto) {
    const accessToken = await this.userAuthService.userLogin(data);
    return {
      statusCode: HttpStatus.CREATED,
      data: accessToken,
      message: 'User Logged in Successfully',
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('user/delete/:id')
  async userDelete(@Param('id') id: string) {
    await this.userAuthService.deleteUser(id);
    return {
      statusCode: HttpStatus.OK,
      data: {
        id,
      },
      message: 'User Deleted Successfully',
    };
  }

  @Post('user/send-otp')
  async sendOtp(@Body() otpDto: UserOtpDto) {
    const otpCode = await this.userAuthService.generateOTP(otpDto);
    return {
      statusCode: HttpStatus.OK,
      data: {
        otp: otpCode,
      },
      message: 'OTP Send Successfully',
    };
  }

  @Post('user/verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.userAuthService.verifyOTP(verifyOtpDto);
    return {
      statusCode: HttpStatus.OK,
      data: {},
      message: 'OTP Verified Successfully',
    };
  }

  @Post('user/forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    await this.userAuthService.forgetPassword(forgetPasswordDto);
    return {
      statusCode: HttpStatus.OK,
      data: {},
      message: 'Password changed successfully',
    };
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const refreshToken = await this.userAuthService.refreshToken(
      req.user.uuid,
      req.headers.authorization,
      req.user.type,
      req.user.sessionId,
    );
    return {
      statusCode: HttpStatus.OK,
      data: refreshToken,
      message: 'Refresh Token added Successfully',
    };
  }
}
