import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UrlEntity } from "../url/url.entity";

@Entity('clicks')
export class ClickEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'url_id' })
  urlId: string;

  @Column({ name: 'clicks_count', default: 0 })
  clicksCount: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => UrlEntity, (url) => url.clicks)
  @JoinColumn({ name: 'url_id' })
  url?: UrlEntity;
}