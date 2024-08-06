import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { DatabaseModule } from './database/database.module';
import { HelperModule } from './helper/helper.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { EmailService } from './util/email.service';

@Module({
  providers: [CommonService, EmailService],
  exports: [CommonService, HelperModule, AuthModule, EmailService],
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
    }),
    DatabaseModule,
    HelperModule,
    AuthModule,
  ],
})
export class CommonModule {}
