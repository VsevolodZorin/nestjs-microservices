import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signUp() {
    return 'sign up from auth microservice';
  }
}
