import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../abstract/entities/abstract.entity';
import { SessionDto } from '../dtos/session.dto';

@Entity({ name: 'userSession' })
export class UserSessionEntity extends AbstractEntity<SessionDto> {
  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
    nullable: false,
  })
  public uuid: string;

  @Column({
    nullable: false,
  })
  userId: string;

  @Column({
    nullable: false,
  })
  public loginTime: Date;

  @Column({
    nullable: false,
  })
  public isLoggedOut: boolean;

  constructor(partial: Partial<UserSessionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
