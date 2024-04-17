import { Controller } from '@nestjs/common';

import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // findAll(): Promise<CommentsListPaginationResponseData> {
  //   return this.commentsService.findAll();
  // }

  // getAllByPostId(
  //   @Param('postId', ParseIntPipe)
  //   postId: number,
  // ) {
  //   return this.commentsService.findAllByPostId(postId);
  // }

  // getCommentsPagination(
  //   @Query() paginationParams: CommentsPaginationParams,
  // ): Promise<CommentsListPaginationResponseData> {
  //   return this.commentsService.getCommentsPagination(paginationParams);
  // }

  // findOneById(@Param('id', ParseIntPipe) id: number) {
  //   return this.commentsService.findOneById(id);
  // }

  // create(
  //   @Body() createCommentDto: CreateCommentDto,
  //   @CurrentUser() user: IUser,
  // ) {
  //   return this.commentsService.create(user, createCommentDto);
  // }

  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateCommentDto: UpdateCommentDto,
  // ) {
  //   return this.commentsService.update(id, updateCommentDto);
  // }

  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.commentsService.remove(+id);
  // }
}
