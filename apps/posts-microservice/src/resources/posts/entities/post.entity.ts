import { IPost } from 'libs';
import { CommentEntity } from 'src/resources/comments/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PostEntity implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text', { array: true })
  paragraphs: string[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.post)
  comments: CommentEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt?: Date;
}
