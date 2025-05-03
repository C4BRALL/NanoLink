import { UserEntity } from 'src/core/domain/entities/user.entity';
import { userEntitySchema } from 'src/core/domain/validations/user.entity.schema';
import { z, ZodError } from 'zod';

describe('UserEntity', () => {
  let userStub: UserEntity;
  const expectedCreatedAt = Date.now();
  const mockDate1 = new Date('2025-05-05T10:00:00Z');
  const mockDate2 = new Date('2025-05-05T10:01:00Z');
  const originalDate = global.Date;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);
    userStub = new UserEntity({
      id: '6e534511-c9db-4c34-916d-13ba093352e4',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    });
    global.Date = originalDate;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when creating a new UserEntity with invalid data', () => {
    const invalidData = {
      id: '6e534511-c9db-4c34-916d-13ba093352e4',
      name: 'err',
      email: 'invalid-email.com',
      password: '12345',
    };

    expect(() => new UserEntity(invalidData)).toThrow(ZodError);
  });

  it('should provide specific error messages for invalid fields', () => {
    try {
      new UserEntity({
        id: '6e534511-c9db-4c34-916d-13ba093352e4',
        name: 'err',
        email: 'invalid-email.com',
        password: '12345',
      });
      fail('Expected ZodError to be thrown');
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.format();
        type FormattedErrors = z.inferFormattedError<typeof userEntitySchema>;

        expect((formattedErrors as FormattedErrors).name?._errors).toBeDefined();
        expect((formattedErrors as FormattedErrors).email?._errors).toBeDefined();
        expect((formattedErrors as FormattedErrors).password?._errors).toBeDefined();
      } else {
        fail('Expected ZodError to be thrown');
      }
    }
  });

  it('Should create a new UserEntity with valid data', () => {
    const validData = {
      id: '6e534511-c9db-4c34-916d-13ba093352e4',
      name: 'John Doe Fenix',
      email: 'john.doe31@mail.com',
      password: '123456hsg',
      createdAt: new Date(expectedCreatedAt),
    };

    const user = new UserEntity(validData);

    expect(user.id).toBe(validData.id);
    expect(user.name).toBe(validData.name);
    expect(user.email).toBe(validData.email);
    expect(user.password).toBe(validData.password);
    expect(user.createdAt).toStrictEqual(validData.createdAt);
  });

  it('Should Get User Data', () => {
    const userData = userStub.getUserData();

    expect(userData.name).toBe(userStub.name);
    expect(userData.email).toBe(userStub.email);
    expect(userData).not.toHaveProperty('password');
  });

  it('Should Soft Delete User', () => {
    global.Date = jest.fn(() => mockDate2) as any;
    global.Date.now = jest.fn(() => mockDate2.getTime());

    userStub.softDelete();

    expect(userStub.deletedAt).toEqual(mockDate2);
    expect(userStub.updatedAt).toEqual(mockDate2);
  });

  it('Should Restore User', () => {
    global.Date = jest.fn(() => mockDate2) as any;
    global.Date.now = jest.fn(() => mockDate2.getTime());

    userStub.softDelete();
    userStub.restore();

    expect(userStub.deletedAt).toBeUndefined();
    expect(userStub.updatedAt).toEqual(mockDate2);
  });

  it('Should Update User', () => {
    userStub.update({
      name: 'John Doe Fenix',
      email: 'john.doe31@mail.com',
      password: '123456hsg123',
    });

    expect(userStub.name).toBe('John Doe Fenix');
    expect(userStub.email).toBe('john.doe31@mail.com');
    expect(userStub.password).toBe('123456hsg123');
    expect(userStub.updatedAt).toBeDefined();
  });

  it('Should Check if User is Deleted', () => {
    userStub.softDelete();

    expect(userStub.isDeleted()).toBe(true);
  });

  it('Should Check if User is not Deleted', () => {
    expect(userStub.isDeleted()).toBe(false);
  });
});
