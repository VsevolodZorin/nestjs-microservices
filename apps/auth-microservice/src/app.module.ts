import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './resources/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigFactory } from './config/orm.config';
import { UsersModule } from './resources/users/users.module';
import { SessionModule } from './resources/session/session.module';
import { LocalFilesModule } from './resources/local-files/local-files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfigFactory,
    }),
    AuthModule,
    UsersModule,
    SessionModule,
    LocalFilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
