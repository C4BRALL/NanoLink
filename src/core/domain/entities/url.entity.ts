import { urlEntitySchema } from '../validations/url.entity.schema';

export class UrlEntity {
  id: string;
  shortCode: string;
  originalUrl: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  clickCount: number;
  lastClickDate?: Date;

  constructor(params: {
    id?: string;
    shortCode: string;
    originalUrl: string;
    userId?: string;
    createdAt?: Date | number;
    updatedAt?: Date | number;
    deletedAt?: Date | number;
    clickCount?: number;
    lastClickDate?: Date;
  }) {
    const validatedData = urlEntitySchema.parse(params);

    this.id = validatedData.id || crypto.randomUUID();
    this.shortCode = validatedData.shortCode;
    this.originalUrl = validatedData.originalUrl;
    this.userId = validatedData.userId;
    this.createdAt = validatedData.createdAt || new Date();
    this.updatedAt = validatedData.updatedAt || new Date();
    this.deletedAt = validatedData.deletedAt;
    this.clickCount = validatedData.clickCount || 0;
    this.lastClickDate = validatedData.lastClickDate || new Date();
  }

  incrementClickCount(): void {
    this.clickCount += 1;
    this.lastClickDate = new Date();
    this.updatedAt = new Date();
  }

  softDelete(): void {
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }

  restore(): void {
    this.deletedAt = undefined;
    this.updatedAt = new Date();
  }

  update(originalUrl: string): void {
    this.originalUrl = originalUrl;
    this.updatedAt = new Date();
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
