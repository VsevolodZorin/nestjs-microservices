import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IPost } from '../../interfaces/post/post.interface';

export class UpdatePostDto implements Partial<IPost> {
  id: number;
}
