import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/resources/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Entity('session')
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.session, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @Column()
  refreshToken: string;

  // todo: fix
  // @BeforeInsert()
  // async hashBeforeInsert() {
  //   const saltRounds = 10;
  //   this.refreshToken = await bcrypt.hash(this.refreshToken, saltRounds);
  // }

  // todo: fix update
  // @BeforeUpdate()
  // async hashBeforeUpdate() {
  //   if (this.refreshToken) {
  //     const saltRounds = 10;
  //     this.refreshToken = await bcrypt.hash(this.refreshToken, saltRounds);
  //   }
  // }
}
