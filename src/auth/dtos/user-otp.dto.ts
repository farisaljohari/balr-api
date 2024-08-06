import { OtpType } from '../../../libs/common/src/constants/otp-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UserOtpDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsEnum(OtpType)
  @IsNotEmpty()
  type: OtpType;
}

export class VerifyOtpDto extends UserOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otpCode: string;
}
