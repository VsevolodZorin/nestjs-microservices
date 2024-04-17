import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CreatePostDto,
  IPaginationResponseData,
  IPost,
  IUser,
  PostsPaginationParams,
  UpdatePostDto,
  kafkaPatterns,
  kafkaResponseErrorWrapper,
} from 'libs';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PostsService implements OnModuleInit {
  constructor(
    @Inject('POSTS_MICROSERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(
      kafkaPatterns.messages.posts.GET_POSTS_PAGINATION,
    );
    this.kafkaClient.subscribeToResponseOf(
      kafkaPatterns.messages.posts.POST_FIND_BY_ID,
    );
    // this.kafkaClient.subscribeToResponseOf(
    //   kafkaPatterns.messages.posts.POST_FIND_BY_SLUG,
    // );
    this.kafkaClient.subscribeToResponseOf(
      kafkaPatterns.messages.posts.POST_CREATED,
    );
    this.kafkaClient.subscribeToResponseOf(
      kafkaPatterns.messages.posts.POST_UPDATED,
    );
    this.kafkaClient.subscribeToResponseOf(
      kafkaPatterns.messages.posts.POST_DELETED,
    );
  }

  async getPostsPagination(
    paginationParams: PostsPaginationParams,
  ): Promise<IPaginationResponseData<IPost> | undefined> {
    try {
      const response = await this.kafkaClient.send<
        IPaginationResponseData<IPost>
      >(kafkaPatterns.messages.posts.GET_POSTS_PAGINATION, paginationParams);

      const responseData =
        await firstValueFrom<IPaginationResponseData<IPost>>(response);

      return responseData;
    } catch (error) {
      await kafkaResponseErrorWrapper(error);
    }
  }

  async findOneById(id: number): Promise<IPost | undefined> {
    try {
      const response = await this.kafkaClient.send<IPost>(
        kafkaPatterns.messages.posts.POST_FIND_BY_ID,
        id,
      );
      return await firstValueFrom<IPost>(response);
    } catch (error) {
      await kafkaResponseErrorWrapper(error);
    }
  }

  // async findOneBySlug(slug: string): Promise<IPost | null> {
  //   try {
  //     const response = await this.kafkaClient.send<IPost>(
  //       kafkaPatterns.messages.posts.POST_FIND_BY_SLUG,
  //       slug,
  //     );
  //     return await firstValueFrom<IPost>(response);
  //   } catch (error) {}
  // }

  async create(
    user: IUser,
    createPostDto: CreatePostDto,
  ): Promise<IPost | undefined> {
    try {
      const response = await this.kafkaClient.send<IPost>(
        kafkaPatterns.messages.posts.POST_CREATED,
        Object.assign(createPostDto, { userId: user.id }),
      );
      return await firstValueFrom<IPost>(response);
    } catch (error) {
      await kafkaResponseErrorWrapper(error);
    }
  }

  // todo: add event
  async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<IPost | undefined> {
    try {
      const response = await this.kafkaClient.send<IPost>(
        kafkaPatterns.messages.posts.POST_UPDATED,
        Object.assign(updatePostDto, { id }),
      );
      return await firstValueFrom<IPost>(response);
    } catch (error) {
      await kafkaResponseErrorWrapper(error);
    }
  }

  async delete(id: number) {
    try {
      const response = await this.kafkaClient.send<{ message: string }>(
        kafkaPatterns.messages.posts.POST_DELETED,
        id,
      );
      return await firstValueFrom<{ message: string }>(response);
    } catch (error) {}
  }
}
