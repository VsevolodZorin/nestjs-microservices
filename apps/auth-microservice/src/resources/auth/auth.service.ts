import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import {
  CreateUserDto,
  IJwtPayload,
  IJwtTokenPair,
  backendMessages,
  databaseCodes,
} from 'libs';
import { SessionService } from '../session/session.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
  ) {}

  async getUser(userId: number) {
    const user = await this.usersService.findOneById(userId);
    return instanceToPlain(user);
  }

  async signUp(createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.usersService.create(createUserDto);
      return instanceToPlain(createdUser);
    } catch (error) {
      if (error.code === databaseCodes.postgresErrorCode.UNIQUE_VIOLATION) {
        throw new BadRequestException(backendMessages.user.USER_EXISTS);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  signIn(user: UserEntity) {
    return this.generateTokenPair({
      id: user.id,
      email: user.email,
    });
  }

  signOut(userId: number) {
    return this.sessionService.delete(userId);
  }

  refresh(user: UserEntity) {
    return this.generateTokenPair({
      id: user.id,
      email: user.email,
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const isPasswordMatching = await this.verifyPassword(
        password,
        user.password!,
      );
      if (isPasswordMatching) {
        return instanceToPlain(user) as UserEntity;
      }
    }
    return null;
  }

  private verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  private async generateAccessToken(payload: IJwtPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return accessToken;
  }

  private async generateRefreshToken(payload: IJwtPayload): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    return refreshToken;
  }

  /**
   * @description create or update session, if session already exists
   */
  async generateTokenPair(payload: IJwtPayload): Promise<IJwtTokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    await this.saveToken(payload.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveToken(userId: number, refreshToken: string): Promise<void> {
    const session = await this.sessionService.findByUserId(userId);
    if (!session) {
      await this.sessionService.create(userId, refreshToken);
    } else {
      await this.sessionService.update(session, refreshToken);
    }
  }

  async getUserIfRefreshTokenMatches(
    userId: number,
    refreshToken: string,
  ): Promise<UserEntity | null> {
    const session = await this.sessionService.findByUserId(userId);
    if (session) {
      // const isRefreshTokenMatching = await this.verifyRefreshToken(
      //   refreshToken,
      //   session.refreshToken,
      // );
      // if (isRefreshTokenMatching) {
      //   return session.user;
      // }
      if (session.refreshToken === refreshToken) {
        const user = session.user;
        return instanceToPlain(user) as UserEntity;
      }
    }

    return null;
  }
}
