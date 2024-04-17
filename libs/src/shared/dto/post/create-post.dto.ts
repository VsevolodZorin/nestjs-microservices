import { PartialType } from '@nestjs/mapped-types';
import { IPost } from '../../interfaces';
import { IComment } from '../../interfaces/comment/comment.interface';

export class CreatePostDto implements Partial<IPost> {
  userId: number;
  slug: string;
  title: string;
  paragraphs: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt?: Date;
}
