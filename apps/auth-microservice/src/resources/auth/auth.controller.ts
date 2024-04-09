import { BadRequestException, Controller, HttpException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, IKafkaResponseError, IUser, kafkaPatterns } from 'libs';
import { AuthService } from './auth.service';
import { UserEntity } from '../users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(kafkaPatterns.messages.auth.SIGN_UP)
  async signUp(@Payload() data: CreateUserDto) {
    try {
      return await this.authService.signUp(data);
    } catch (error) {
      const responseError: IKafkaResponseError = {
        message: error.response.message,
        error: error.response.error,
        statusCode: error.response.statusCode,
      };
      return responseError;
    }
  }

  @MessagePattern(kafkaPatterns.messages.auth.SIGN_IN)
  async signIn(@Payload() data: UserEntity) {
    try {
      return await this.authService.signIn(data);
    } catch (error) {
      const responseError: IKafkaResponseError = {
        message: error.response.message,
        error: error.response.error,
        statusCode: error.response.statusCode,
      };
      return responseError;
    }
  }

  @MessagePattern(kafkaPatterns.messages.auth.VALIDATE_USER)
  async validateUser(@Payload() data: { email: string; password: string }) {
    return this.authService.validateUser(data.email, data.password);
  }
}
