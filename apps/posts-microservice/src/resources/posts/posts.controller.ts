import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreatePostDto,
  IKafkaResponseError,
  PostsPaginationParams,
  UpdatePostDto,
  kafkaPatterns,
} from 'libs';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @MessagePattern(kafkaPatterns.messages.posts.GET_POSTS_PAGINATION)
  async getPostsPagination(@Payload() paginationParams: PostsPaginationParams) {
    try {
      return await this.postsService.getPostsPagination(paginationParams);
    } catch (error) {
      const responseError: IKafkaResponseError = {
        message: error.response.message,
        error: error.response.error,
        statusCode: error.response.statusCode,
      };
      return responseError;
    }
  }

  @MessagePattern(kafkaPatterns.messages.posts.POST_FIND_BY_ID)
  async findOneById(@Payload() id: number) {
    try {
      return await this.postsService.findOneById(id);
    } catch (error) {
      const responseError: IKafkaResponseError = {
        message: error.response.message,
        error: error.response.error,
        statusCode: error.response.statusCode,
      };
      return responseError;
    }
  }

  @MessagePattern(kafkaPatterns.messages.posts.POST_CREATED)
  async create(@Payload() createPostDto: CreatePostDto) {
    try {
      return await this.postsService.create(createPostDto);
    } catch (error) {
      const responseError: IKafkaResponseError = {
        message: error.response.message,
        error: error.response.error,
        statusCode: error.response.statusCode,
      };
      return responseError;
    }
  }

  @MessagePattern(kafkaPatterns.messages.posts.POST_UPDATED)
  update(@Payload() updateData: UpdatePostDto) {
    try {
      return this.postsService.update(updateData.id, updateData);
    } catch (error) {
      const responseError: IKafkaResponseError = {
        message: error.response.message,
        error: error.response.error,
        statusCode: error.response.statusCode,
      };
      return responseError;
    }
  }

  @MessagePattern(kafkaPatterns.messages.posts.POST_DELETED)
  async delete(@Payload() id: number) {
    try {
      return await this.postsService.delete(id);
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
