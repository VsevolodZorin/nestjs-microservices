import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostsService } from './posts.service';
import { kafkaPatterns } from 'libs';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @MessagePattern('createPost')
  // create(@Payload() createPostDto: CreatePostDto) {
  //   return this.postsService.create(createPostDto);
  // }

  @MessagePattern(kafkaPatterns.messages.posts.POST_FIND_ALL)
  findAll() {
    return this.postsService.findAll();
  }

  // @MessagePattern('findOnePost')
  // findOne(@Payload() id: number) {
  //   return this.postsService.findOne(id);
  // }

  // @MessagePattern('updatePost')
  // update(@Payload() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(updatePostDto.id, updatePostDto);
  // }

  // @MessagePattern('removePost')
  // remove(@Payload() id: number) {
  //   return this.postsService.remove(id);
  // }
}
