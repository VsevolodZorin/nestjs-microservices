import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POSTS_MICROSERVICE') private readonly postsClient: ClientKafka,
  ) {}
  // create(createPostDto: CreatePostDto) {
  //   return 'This action adds a new post';
  // }

  findAll() {
    return this.postsClient.send(
      'posts.findAll',
      `This action returns all post`,
    );
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
