import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PostsController } from './posts.controller';
import { PostsService } from './post.service';
import { postsMicroserviceConfig } from '../../config/posts-microservice.config';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'POSTS_MICROSERVICE',
        ...postsMicroserviceConfig,
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
