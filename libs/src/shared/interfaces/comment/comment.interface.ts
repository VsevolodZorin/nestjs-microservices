import { IPost } from '../post/post.interface';

export interface IComment {
  id: number;

  userId: number;

  content: string;

  post: IPost;

  postId: number;

  parentComment?: IComment;

  parentCommentId?: number;

  childComments?: IComment[];

  createdAt: Date;

  updatedAt?: Date;
}
