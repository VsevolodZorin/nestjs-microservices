import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LocalFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  path: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;
}
