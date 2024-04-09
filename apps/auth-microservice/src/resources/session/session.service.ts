import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SessionEntity } from './entities/session.entity';
import { backendMessages } from 'libs';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * @description 1 user can have only 1 session. Login only 1 device. Login another device will invalidate the previous session
   */
  async create(userId: number, refreshToken: string): Promise<SessionEntity> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(backendMessages.user.NOT_FOUND);
    }

    const newSession = this.sessionRepository.create({
      user: user,
      refreshToken: refreshToken,
    });

    return await this.sessionRepository.save(newSession);
  }

  findByUserId(userId: number): Promise<SessionEntity | null> {
    return this.sessionRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  // todo: fix update and verify hashed refresh token
  async getUserIfRefreshTokenMatches(
    userId: number,
    refreshToken: string,
  ): Promise<UserEntity | null> {
    const session = await this.findByUserId(userId);
    if (session) {
      // const isRefreshTokenMatching = await this.verifyRefreshToken(
      //   refreshToken,
      //   session.refreshToken,
      // );
      // if (isRefreshTokenMatching) {
      //   return session.user;
      // }
      if (session.refreshToken === refreshToken) {
        return session.user;
      }
    }

    return null;
  }

  private verifyRefreshToken(
    plainTextRefreshToken: string,
    hashedRefreshToken: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextRefreshToken, hashedRefreshToken);
  }

  async update(
    session: SessionEntity,
    refreshToken: string,
  ): Promise<UpdateResult> {
    return await this.sessionRepository.update(
      {
        id: session!.id,
      },
      { refreshToken },
    );
  }

  async delete(userId: number): Promise<DeleteResult> {
    const session = await this.findByUserId(userId);

    if (!session) {
      throw new NotFoundException(backendMessages.session.NOT_FOUND);
    }

    return await this.sessionRepository.delete(session.id);
  }
}
