import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreatePostDto,
  IPaginationResponseData,
  PostsPaginationParams,
  UpdatePostDto,
  backendMessages,
  databaseCodes,
} from 'libs';
import { DeleteResult, Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async getPostsPagination(
    paginationParams: PostsPaginationParams,
  ): Promise<IPaginationResponseData<PostEntity>> {
    try {
      const { limit, skip, sortBy, sortOrder } = paginationParams;
      const queryBuilder = this.postsRepository.createQueryBuilder('post');
      queryBuilder.select([
        'post.id',
        'post.userId',
        'post.title',
        'post.slug',
        'post.paragraphs',
        'post.createdAt',
      ]);

      if (sortBy && sortOrder) {
        queryBuilder.orderBy(`post.${sortBy}`, sortOrder);
      } else if (!sortBy && sortOrder) {
        queryBuilder.orderBy('post.createdAt', sortOrder);
      } else if (sortBy && !sortOrder) {
        queryBuilder.orderBy(`post.${sortBy}`, 'ASC');
      }

      queryBuilder.skip(skip).take(limit);

      const [items, total] = await queryBuilder.getManyAndCount();
      return { items, total };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneById(id: number): Promise<PostEntity> {
    try {
      const queryBuilder = this.postsRepository.createQueryBuilder('post');
      queryBuilder
        .where('post.id = :id', { id })
        .select([
          'post.id',
          'post.userId',
          'post.title',
          'post.slug',
          'post.paragraphs',
          'post.createdAt',
        ]);
      const post = await queryBuilder.getOne();
      if (!post) {
        throw new NotFoundException(backendMessages.post.POST_NOT_FOUND);
      }
      return { ...post };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneBySlug(slug: string): Promise<PostEntity | null> {
    try {
      const queryBuilder = this.postsRepository.createQueryBuilder('post');
      queryBuilder
        .where('post.slug = :slug', { slug })
        .select([
          'post.id',
          'post.userId',
          'post.title',
          'post.slug',
          'post.paragraphs',
          'post.createdAt',
        ]);
      const post = await queryBuilder.getOne();
      if (!post) {
        throw new NotFoundException(backendMessages.post.POST_NOT_FOUND);
      }
      return { ...post };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createPostDto: CreatePostDto) {
    try {
      const newPost = this.postsRepository.create(createPostDto);
      const savedPost = await this.postsRepository.save(newPost);
      return { ...savedPost };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === databaseCodes.postgresErrorCode.UNIQUE_VIOLATION) {
        throw new BadRequestException(
          backendMessages.post.POST_WITH_THIS_SLUG_EXISTS,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    try {
      const post = await this.findOneById(id);
      await this.postsRepository.update(post!.id, updatePostDto);

      return await this.findOneById(post!.id);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `--- posts-microservice -> update -> ${error.message}`,
      );
    }
  }

  // todo: result type
  async delete(id: number) {
    try {
      const post = await this.findOneById(id);

      const result = await this.postsRepository.delete(post!.id);
      if (result.affected === 1) {
        return { message: backendMessages.post.POST_DELETED_SUCCESSFULLY };
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
