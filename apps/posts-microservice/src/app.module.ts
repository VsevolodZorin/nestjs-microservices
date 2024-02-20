import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './resources/posts/posts.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
