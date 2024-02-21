import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { PostsService } from './post.service';

import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { kafkaPatterns } from 'libs';

@Controller('posts')
export class PostsController implements OnModuleInit {
  constructor(private readonly postsService: PostsService) {}
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'posts',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'posts-consumer',
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf(
      kafkaPatterns.messages.posts.POST_FIND_ALL,
    );
  }
  // @Post()
  // create(@Body() createPostDto: CreatePostDto) {
  //   return this.postsService.create(createPostDto);
  // }

  @Get()
  findAll() {
    return this.client.send(kafkaPatterns.messages.posts.POST_FIND_ALL, '');
    // return this.postsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postsService.remove(+id);
  // }
}
