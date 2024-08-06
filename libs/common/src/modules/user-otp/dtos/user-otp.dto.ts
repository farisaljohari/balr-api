import { IsNotEmpty, IsString } from 'class-validator';

export class UserOtpDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public otpCode: string;

  @IsString()
  @IsNotEmpty()
  public expiryTime: string;
}
