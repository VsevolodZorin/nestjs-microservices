import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { UpdateUserDto } from 'libs/src/shared/dto/user/update-user.dto';
import { Repository } from 'typeorm';
import { LocalFileEntity } from '../local-files/entities/local-file.entity';
import { LocalFilesService } from '../local-files/local-files.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from 'libs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly localFilesService: LocalFilesService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  // todo: check @BeforeUpdate()
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  delete(id: number) {
    return this.usersRepository.delete(id);
  }

  findOneById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async getProfile(id: number): Promise<UserEntity> {
    try {
      const queryBuilder = this.usersRepository.createQueryBuilder('user');
      queryBuilder
        .leftJoinAndSelect('user.avatar', 'avatar')
        .where('user.id = :id', { id });
      const user = await queryBuilder.getOne();
      return instanceToPlain(user) as UserEntity;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAvatarByUserId(id: number): Promise<LocalFileEntity | null> {
    try {
      const queryBuilder = this.usersRepository.createQueryBuilder('user');
      queryBuilder
        .leftJoinAndSelect('user.avatar', 'avatar')
        .where('user.id = :id', { id });
      const user = await queryBuilder.getOne();
      return user?.avatar || null;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // async addAvatar(userId: number, file: Express.Multer.File) {
  //   try {
  //     const avatar = await this.getAvatarByUserId(userId);

  //     if (avatar) {
  //       this.localFilesService.removeFileFromStorage(avatar.filename);
  //       await this.localFilesService.updateLocalFile(avatar.id, file);
  //       return backendMessages.user.avatarUpdated;
  //     } else {
  //       const fileData = await this.localFilesService.createLocalFile(file);
  //       await this.usersRepository.update(userId, { avatar: fileData });
  //       return backendMessages.user.avatarAdded;
  //     }
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
