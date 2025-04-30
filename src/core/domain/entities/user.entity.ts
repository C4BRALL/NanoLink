import { UserEntitySchema, userEntitySchema } from '../validations/user.entity.schema';

export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(params: UserEntitySchema) {
    const validatedParams = userEntitySchema.parse(params);
    this.id = validatedParams.id || crypto.randomUUID();
    this.name = validatedParams.name;
    this.email = validatedParams.email;
    this.password = validatedParams.password;
    this.createdAt = validatedParams.createdAt || new Date();
    this.updatedAt = validatedParams.updatedAt || new Date();
    this.deletedAt = validatedParams.deletedAt;
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

  getUserData() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
