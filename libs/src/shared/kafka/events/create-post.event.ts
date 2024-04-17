import { CreatePostDto } from '../../dto';
import { IComment } from '../../interfaces';

export class CreatePostEvent {
  id: number;
  userId: number;
  slug: string;
  title: string;
  paragraphs: string[];
  comments: IComment[];
  constructor(createPostDto: CreatePostDto) {
    this.userId = createPostDto.userId;
    this.slug = createPostDto.slug;
    this.title = createPostDto.title;
    this.paragraphs = createPostDto.paragraphs;
    this.comments = createPostDto.comments;
  }
}
