import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './strategies';
import { UserEntity } from '../modules/user/entities/user.entity';
import { UserSessionEntity } from '../modules/session/entities/session.entity';
import { UserOtpEntity } from '../modules/user-otp/entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'postgres',
        host: configService.get('AZURE_POSTGRESQL_HOST'),
        port: configService.get('AZURE_POSTGRESQL_PORT'),
        username: configService.get('AZURE_POSTGRESQL_USER'),
        password: configService.get('AZURE_POSTGRESQL_PASSWORD'),
        database: configService.get('AZURE_POSTGRESQL_DATABASE'),
        entities: [UserEntity, UserSessionEntity, UserOtpEntity],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: Boolean(
          JSON.parse(configService.get('AZURE_POSTGRESQL_SYNC')),
        ),
        logging: false,
        extra: {
          charset: 'utf8mb4',
          max: 20, // set pool max size
          idleTimeoutMillis: 5000, // close idle clients after 5 second
          connectionTimeoutMillis: 11000, // return an error after 11 second if connection could not be established
          maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
          ssl:
            configService.get('AZURE_POSTGRESQL_SSL') === 'true'
              ? {
                  rejectUnauthorized: false,
                }
              : undefined,
        },
        continuationLocalStorage: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
