import { IsNotEmpty, IsString } from 'class-validator';
import { backendMessages } from '../../constants';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty({ message: backendMessages.comment.EMPTY })
  content: string;
}
