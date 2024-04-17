import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';
import { CommentEntity } from './entities/comment.entity';
import { CommentsListPaginationResponseData } from './types/comments-list-pagination-response';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>,
    private readonly postsService: PostsService,
  ) {}

  async findAll(): Promise<CommentsListPaginationResponseData> {
    try {
      const queryBuilder =
        this.commentsRepository.createQueryBuilder('comment');
      queryBuilder
        .leftJoinAndSelect('comment.post', 'post')
        .leftJoinAndSelect('comment.author', 'author')
        .select([
          'comment.id',
          'comment.content',
          'comment.createdAt',
          'comment.parentComment.id',
          'post.id',
          'author.id',
          'author.email',
          'author.username',
        ]);
      const [items, total] = await queryBuilder.getManyAndCount();
      return { items, total };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // async findAllByPostId(
  //   id: number,
  // ): Promise<CommentsListPaginationResponseData> {
  //   try {
  //     await this.postsService.findOneById(id);

  //     const queryBuilder =
  //       this.commentsRepository.createQueryBuilder('comment');
  //     queryBuilder
  //       .leftJoinAndSelect('comment.post', 'post')
  //       .leftJoinAndSelect('comment.author', 'author')
  //       .where('comment.post.id = :id', { id })
  //       .select([
  //         'comment.id',
  //         'comment.content',
  //         'comment.createdAt',
  //         'comment.parentComment.id',
  //         'post.id',
  //         'author.id',
  //         'author.email',
  //         'author.username',
  //       ]);

  //     const [items, total] = await queryBuilder.getManyAndCount();
  //     return { items, total };
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async getCommentsPagination(
  //   paginationParams: CommentsPaginationParams,
  // ): Promise<CommentsListPaginationResponseData> {
  //   try {
  //     const { limit, skip, postId, parentCommentId } = paginationParams;
  //     const queryBuilder =
  //       this.commentsRepository.createQueryBuilder('comment');
  //     queryBuilder
  //       .leftJoinAndSelect('comment.post', 'post')
  //       .leftJoinAndSelect('comment.author', 'author')
  //       .leftJoinAndSelect('comment.childComments', 'childComments')
  //       .select([
  //         'comment.id',
  //         'comment.content',
  //         'comment.createdAt',
  //         'comment.updatedAt',
  //         'comment.parentComment.id',
  //         // for client to know if comment has children
  //         'childComments',
  //         'post.id',
  //         'author.id',
  //         'author.email',
  //         'author.username',
  //       ]);

  //     queryBuilder.where('comment.post.id = :postId', { postId });

  //     if (parentCommentId) {
  //       queryBuilder.where('comment.parentComment.id = :parentCommentId', {
  //         parentCommentId,
  //       });
  //     } else {
  //       queryBuilder.where('comment.parentComment.id IS NULL');
  //     }

  //     queryBuilder.orderBy('comment.createdAt');
  //     queryBuilder.skip(skip).take(limit);

  //     const [items, total] = await queryBuilder.getManyAndCount();
  //     return { items, total };
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async findOneById(id: number): Promise<CommentEntity | null> {
  //   try {
  //     const queryBuilder =
  //       this.commentsRepository.createQueryBuilder('comment');
  //     queryBuilder
  //       .leftJoinAndSelect('comment.post', 'post')
  //       .leftJoinAndSelect('comment.author', 'author')
  //       .select([
  //         'comment.id',
  //         'comment.content',
  //         'comment.createdAt',
  //         'comment.updatedAt',
  //         'comment.parentComment.id',
  //         'post.id',
  //         'author.id',
  //         'author.email',
  //         'author.username',
  //       ]);
  //     queryBuilder.where('comment.id = :id', { id });
  //     const comment = await queryBuilder.getOne();
  //     if (!comment) {
  //       throw new NotFoundException(backendMessages.comment.COMMENT_NOT_FOUND);
  //     }
  //     return comment;
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async create(
  //   user: UserEntity,
  //   createCommentDto: CreateCommentDto,
  // ): Promise<CommentEntity | null> {
  //   const { content, postId, parentCommentId } = createCommentDto;
  //   const post = await this.postsService.findOneById(postId);

  //   let comment: CommentEntity;
  //   if (parentCommentId) {
  //     const parentComment = await this.findOneById(parentCommentId);
  //     comment = this.commentsRepository.create({
  //       content,
  //     });
  //     comment.post = post!;
  //     comment.author = user;
  //     comment.parentComment = parentComment!;
  //   } else {
  //     comment = this.commentsRepository.create({
  //       content,
  //     });
  //     comment.post = post!;
  //     comment.author = user;
  //   }
  //   const savedComment = await this.commentsRepository.save(comment);

  //   // todo: optimize
  //   this.eventEmitter.emit(
  //     eventName.COMMENT_CREATED,
  //     new CommentCreatedEvent(post!.id),
  //   );
  //   return await this.findOneById(savedComment.id);
  // }

  // async update(id: number, updateCommentDto: UpdateCommentDto) {
  //   try {
  //     const comment = await this.findOneById(id);

  //     this.eventEmitter.emit(
  //       eventName.COMMENT_UPDATED,
  //       new CommentUpdatedEvent(comment!.postId),
  //     );

  //     return await this.commentsRepository.update(
  //       comment!.id,
  //       updateCommentDto,
  //     );
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async remove(id: number) {
  //   try {
  //     const comment = await this.findOneById(id);
  //     return this.commentsRepository.delete(comment!.id);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
