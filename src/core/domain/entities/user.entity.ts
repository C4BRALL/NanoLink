export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(params: {
    id?: string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    this.id = params.id || crypto.randomUUID();
    this.name = params.name;
    this.email = params.email;
    this.password = params.password;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.deletedAt = params.deletedAt;
  }

  softDelete(): void {
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }

  restore(): void {
    this.deletedAt = undefined;
    this.updatedAt = new Date();
  }

  update(params: { name?: string; email?: string; password?: string }): void {
    if (params.name) this.name = params.name;
    if (params.email) this.email = params.email;
    if (params.password) this.password = params.password;
    this.updatedAt = new Date();
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}