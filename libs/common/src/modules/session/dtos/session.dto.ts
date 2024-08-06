import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class SessionDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsDate()
  @IsNotEmpty()
  public loginTime: Date;

  @IsBoolean()
  @IsNotEmpty()
  public isLoggedOut: boolean;
}
