import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserOtpEntity } from '../entities';

@Injectable()
export class UserOtpRepository extends Repository<UserOtpEntity> {
  constructor(private dataSource: DataSource) {
    super(UserOtpEntity, dataSource.createEntityManager());
  }
}
