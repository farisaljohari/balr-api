import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionEntity } from './entities';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [TypeOrmModule.forFeature([UserSessionEntity])],
})
export class UserSessionRepositoryModule {}
