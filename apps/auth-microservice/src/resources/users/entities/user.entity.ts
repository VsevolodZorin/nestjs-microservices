import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SessionEntity } from 'src/resources/session/entities/session.entity';
import { LocalFileEntity } from 'src/resources/local-files/entities/local-file.entity';
import { IUser } from 'libs';

@Entity('users')
@Unique(['email'])
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ nullable: true, default: null })
  password?: string;

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => LocalFileEntity, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  avatar?: LocalFileEntity;

  @Exclude()
  @Column({ nullable: true })
  avatarId?: number;

  @Exclude()
  @OneToOne(() => SessionEntity, (session) => session.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  session?: SessionEntity;

  @BeforeInsert()
  async hashPassword() {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}
