import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserModel } from './user.model';

@Entity('urls')
export class UrlModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'short_code', unique: true, length: 6 })
  shortCode: string;

  @Column({ name: 'original_url', type: 'text' })
  originalUrl: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string | undefined;

  @ManyToOne(() => UserModel, (user) => user.urls)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column({ name: 'click_count', default: 0 })
  clickCount: number;

  @Column({ name: 'last_click_date', nullable: true, type: 'timestamp with time zone' })
  lastClickDate: Date | undefined;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true, type: 'timestamp with time zone' })
  deletedAt: Date | undefined;
}
