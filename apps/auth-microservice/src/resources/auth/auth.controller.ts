import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, IKafkaResponseError, kafkaPatterns } from 'libs';
import { UserEntity } from '../users/entities/user.entity';
import { AuthService } from './auth.service';

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

  @MessagePattern(kafkaPatterns.messages.auth.SIGN_OUT)
  async signOut(@Payload() userId: number) {
    try {
      const result = await this.authService.signOut(userId);
      if (result.affected === 1) {
        return { message: 'User signed out successfully' };
      }
      return { message: 'User not signed out' };
    } catch (error) {
      const responseError: IKafkaResponseError = {
        message: error.response.message,
        error: error.response.error,
        statusCode: error.response.statusCode,
      };
      return responseError;
    }
  }

  @MessagePattern(kafkaPatterns.messages.auth.REFRESH)
  async refresh(@Payload() data: UserEntity) {
    try {
      return await this.authService.refresh(data);
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

  @MessagePattern(kafkaPatterns.messages.auth.GET_USER_IF_REFRESH_TOKEN_MATCHES)
  async getUserIfRefreshTokenMatches(
    @Payload() data: { userId: number; refreshToken: string },
  ) {
    try {
      const result = await this.authService.getUserIfRefreshTokenMatches(
        data.userId,
        data.refreshToken,
      );
      return result;
    } catch (error) {
      const responseError: IKafkaResponseError = {
        message: error.response.message,
        error: error.response.error,
        statusCode: error.response.statusCode,
      };
      return responseError;
    }
  }
}
