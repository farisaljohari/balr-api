import { PositionEnum } from '@app/common/constants/position.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UserSignUpDto {
  @ApiProperty({ description: 'email', required: true })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ description: 'password', required: true })
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiProperty({ description: 'full name', required: true })
  @IsString()
  @IsNotEmpty()
  public fullName: string;

  @ApiProperty({
    description: 'Date of birth (YYYY-MM-DD)',
    required: true,
    example: '2000-05-21',
  })
  @IsNotEmpty()
  @IsDateString()
  public dateOfBirth: string;

  @ApiProperty({
    description: 'Player position',
    required: true,
    enum: PositionEnum,
    enumName: 'PositionEnum',
  })
  @IsNotEmpty()
  @IsEnum(PositionEnum)
  public position: PositionEnum;

  @ApiProperty({
    description: 'User agreed to the policy',
    required: true,
    example: true,
  })
  @IsBoolean()
  @Equals(true, { message: 'policyAgreement must be true to register' })
  public policyAgreement: boolean;
}
