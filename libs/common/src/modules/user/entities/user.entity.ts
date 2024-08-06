import { Column, Entity } from 'typeorm';
import { UserDto } from '../dtos';
import { AbstractEntity } from '../../abstract/entities/abstract.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()', // Use gen_random_uuid() for default value
    nullable: false,
  })
  public uuid: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  public password: string;

  @Column()
  public fullName: string;

  @Column({
    nullable: true,
  })
  public refreshToken: string;

  @Column({
    nullable: true,
    default: false,
  })
  public isUserVerified: boolean;

  @Column({
    nullable: false,
    default: true,
  })
  public isActive: boolean;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
