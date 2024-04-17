import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { postsMicroserviceConfig } from '../../config/posts-microservice.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
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
