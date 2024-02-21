import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { kafkaPatterns } from 'libs';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(kafkaPatterns.messages.auth.SIGN_UP)
  signUp() {
    return this.authService.signUp();
  }
}
