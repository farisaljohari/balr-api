import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserSessionEntity } from '../entities';

@Injectable()
export class UserSessionRepository extends Repository<UserSessionEntity> {
  constructor(private dataSource: DataSource) {
    super(UserSessionEntity, dataSource.createEntityManager());
  }
}
