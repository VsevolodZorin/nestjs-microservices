import { CommentEntity } from '../entities/comment.entity';

export class CommentsListPaginationResponseData {
  items: CommentEntity[];

  total: number;
}
