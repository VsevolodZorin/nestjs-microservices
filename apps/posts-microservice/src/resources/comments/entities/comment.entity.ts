import { IComment } from 'libs';
import { PostEntity } from 'src/resources/posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('comments')
export class CommentEntity implements IComment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  userId: number;

  @Column()
  public content: string;

  @Index('comment_postId_index')
  @ManyToOne(() => PostEntity, (post: PostEntity) => post.comments, {
    onDelete: 'CASCADE',
  })
  public post: PostEntity;

  @RelationId((comment: CommentEntity) => comment.post)
  public postId: number;

  @ManyToOne(
    () => CommentEntity,
    (comment: CommentEntity) => comment.childComments,
    { onDelete: 'CASCADE' },
  )
  public parentComment?: CommentEntity;

  @RelationId((comment: CommentEntity) => comment.parentComment)
  public parentCommentId?: number;

  @OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.parentComment,
    { onDelete: 'CASCADE' },
  )
  public childComments?: CommentEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt?: Date;
}
