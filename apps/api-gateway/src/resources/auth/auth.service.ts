import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AuthService implements OnModuleInit {
  // constructor(
  //   @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  // ) {}

  onModuleInit() {
    // this.authClient.subscribeToResponseOf('signUp');
    // // this.authClient.subscribeToResponseOf('signUp.reply');
    // this.authClient.connect();
  }
  signUp() {
    // todo: add kafka message name
    // return this.authClient.send('signUp', 'sign up from api-gateway');
  }
}
