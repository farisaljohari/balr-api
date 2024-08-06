import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOtpEntity } from './entities';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [TypeOrmModule.forFeature([UserOtpEntity])],
})
export class UserOtpRepositoryModule {}
