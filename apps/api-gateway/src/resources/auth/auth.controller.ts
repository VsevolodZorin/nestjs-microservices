import { Controller, OnModuleInit, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'auth-consumer',
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('signUp');
    await this.client.connect();
  }

  @Post('sign-up')
  async signUp() {
    return this.client.send('signUp', 'sign up from api-gateway');
    // return await this.authService.signUp();
  }
}
