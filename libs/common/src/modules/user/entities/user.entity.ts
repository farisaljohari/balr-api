import { PositionEnum } from '@app/common/constants/position.enum';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../abstract/entities/abstract.entity';
import { UserDto } from '../dtos';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
    nullable: false,
  })
  public uuid: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  public password: string;

  @Column()
  public fullName: string;

  // NEW: Date of birth (date only)
  @Column({ type: 'date', nullable: true })
  public dateOfBirth?: string; // ISO date (YYYY-MM-DD)

  // NEW: Playing position (enum)
  @Column({
    type: 'enum',
    enum: PositionEnum,
    nullable: true, // set to false if you want it required
  })
  public position?: PositionEnum;

  // NEW: Policy agreement (boolean)
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  public policyAgreement: boolean;

  @Column({ nullable: true })
  public refreshToken: string;

  @Column({ nullable: true, default: false })
  public isUserVerified: boolean;

  @Column({ nullable: false, default: true })
  public isActive: boolean;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
