import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { authMicroserviceConfig } from '../../config/auth-microservice.config';
@Module({
  imports: [
    JwtModule.register({}),
    ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE',
        ...authMicroserviceConfig,
      },
    ]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
