import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ClickEntity } from '../click/click.entity';

@Entity('urls')
export class UrlEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'origin_url', length: 2048 })
  originUrl: string;

  @Column({ name: 'short_code', length: 6, unique: true })
  shortCode: string;

  @ManyToOne(() => UserEntity, (user) => user.urls)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => ClickEntity, (click) => click.url)
  clicks: ClickEntity[];

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
