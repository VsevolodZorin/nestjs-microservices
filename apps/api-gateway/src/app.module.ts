import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './resources/auth/auth.module';
import { PostsModule } from './resources/post/posts.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
