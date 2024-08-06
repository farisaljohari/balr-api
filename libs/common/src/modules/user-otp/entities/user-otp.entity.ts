import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../abstract/entities/abstract.entity';
import { UserOtpDto } from '../dtos';
import { OtpType } from '../../../../src/constants/otp-type.enum';

@Entity({ name: 'user-otp' })
export class UserOtpEntity extends AbstractEntity<UserOtpDto> {
  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
    nullable: false,
  })
  public uuid: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  otpCode: string;

  @Column({ nullable: false })
  expiryTime: Date;

  @Column({
    type: 'enum',
    enum: Object.values(OtpType),
  })
  type: OtpType;

  constructor(partial: Partial<UserOtpEntity>) {
    super();
    Object.assign(this, partial);
  }
}
