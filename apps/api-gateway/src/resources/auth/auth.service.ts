import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { kafkaPatterns } from 'libs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf(kafkaPatterns.messages.auth.SIGN_UP);
  }
  async signUp() {
    return await this.authClient.send(
      kafkaPatterns.messages.auth.SIGN_UP,
      'sign up from api-gateway',
    );
  }
}
