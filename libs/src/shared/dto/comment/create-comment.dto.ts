import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { backendMessages } from '../../constants';

export class CreateCommentDto {
  @IsNotEmpty({ message: backendMessages.comment.EMPTY })
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsNumber()
  @IsOptional()
  parentCommentId?: number;
}
