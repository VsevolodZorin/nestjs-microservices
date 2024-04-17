import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CreateUserDto,
  IJwtTokenPair,
  IUser,
  kafkaPatterns,
  kafkaResponseErrorWrapper,
} from 'libs';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(kafkaPatterns.messages.auth.SIGN_UP);
    this.kafkaClient.subscribeToResponseOf(kafkaPatterns.messages.auth.SIGN_IN);
    this.kafkaClient.subscribeToResponseOf(
      kafkaPatterns.messages.auth.SIGN_OUT,
    );
    this.kafkaClient.subscribeToResponseOf(kafkaPatterns.messages.auth.REFRESH);
    this.kafkaClient.subscribeToResponseOf(
      kafkaPatterns.messages.auth.GET_USER,
    );
    this.kafkaClient.subscribeToResponseOf(
      kafkaPatterns.messages.auth.VALIDATE_USER,
    );
    this.kafkaClient.subscribeToResponseOf(
      kafkaPatterns.messages.auth.GET_USER_IF_REFRESH_TOKEN_MATCHES,
    );
  }

  async getUser(user: IUser) {
    try {
      const response = await this.kafkaClient.send(
        kafkaPatterns.messages.auth.GET_USER,
        Object.assign({}, { userId: user.id }),
      );

      return await firstValueFrom<IUser>(response);
    } catch (error) {
      await kafkaResponseErrorWrapper(error);
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    try {
      const response = await this.kafkaClient.send(
        kafkaPatterns.messages.auth.SIGN_UP,
        createUserDto,
      );

      const responseData = await firstValueFrom<IUser>(response);
      if (responseData.email) {
        return responseData;
      }
      throw responseData;
    } catch (error) {
      await kafkaResponseErrorWrapper(error);
    }
  }

  async signIn(user: IUser): Promise<IJwtTokenPair | undefined> {
    try {
      const response = await this.kafkaClient.send(
        kafkaPatterns.messages.auth.SIGN_IN,
        user,
      );

      const responseData = await firstValueFrom<IJwtTokenPair>(response);

      if ((responseData as IJwtTokenPair).accessToken) {
        return responseData;
      }

      throw responseData;
    } catch (error) {
      await kafkaResponseErrorWrapper(error);
    }
  }

  async signOut(userId: number) {
    try {
      const response = await this.kafkaClient.send(
        kafkaPatterns.messages.auth.SIGN_OUT,
        userId,
      );
      return await firstValueFrom(response);
    } catch (error) {
      await kafkaResponseErrorWrapper(error);
    }
  }

  async refresh(user: IUser) {
    try {
      const response = await this.kafkaClient.send(
        kafkaPatterns.messages.auth.REFRESH,
        user,
      );

      const responseData = await firstValueFrom<IJwtTokenPair>(response);

      if ((responseData as IJwtTokenPair).accessToken) {
        return responseData;
      }

      throw responseData;
    } catch (error) {
      await kafkaResponseErrorWrapper(error);
    }
  }

  async validateUser(email: string, password: string): Promise<IUser> {
    try {
      const response = await this.kafkaClient.send(
        kafkaPatterns.messages.auth.VALIDATE_USER,
        { email, password },
      );

      const user = await firstValueFrom<IUser>(response);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserIfRefreshTokenMatches(userId: string, refreshToken: string) {
    try {
      const response = await this.kafkaClient.send(
        kafkaPatterns.messages.auth.GET_USER_IF_REFRESH_TOKEN_MATCHES,
        { userId, refreshToken },
      );

      const responseData = await firstValueFrom<IUser>(response);
      return responseData as IUser;
    } catch (error) {
      throw error;
    }
  }
}
