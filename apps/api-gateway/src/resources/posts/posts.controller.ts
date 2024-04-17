import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  IPaginationResponseData,
  IPost,
  IUser,
  PostsPaginationParams,
  UpdatePostDto,
} from 'libs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPostsPagination(
    @Query() paginationParams: PostsPaginationParams,
  ): Promise<IPaginationResponseData<IPost> | undefined> {
    return this.postsService.getPostsPagination(paginationParams);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOneById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: IUser,
  ): Promise<IPost | undefined> {
    return this.postsService.create(user, createPostDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
