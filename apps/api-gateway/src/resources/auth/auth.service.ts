import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('signUp');
    await this.authClient.connect();
  }
  async signUp() {
    // todo: add kafka message name
    return await this.authClient.send('signUp', 'sign up from api-gateway');

    // this.authClient.emit('testEmit', 'sign up from api-gateway');
  }
}
