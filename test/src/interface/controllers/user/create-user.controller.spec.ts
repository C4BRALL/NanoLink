import { CreateUserController } from 'src/interface/controllers/user/create-user.controller';
import { CreateUserService } from 'src/core/use-cases/user/create-user.service';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { CreateUserDto } from 'src/interface/dtos/user/create-user.dto';
import { Response } from 'express';

describe('CreateUserController', () => {
  let controller: CreateUserController;
  let service: jest.Mocked<CreateUserService>;
  let res: jest.Mocked<Response>;

  beforeEach(() => {
    service = { execute: jest.fn() } as any;
    controller = new CreateUserController(service);
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<Response>;
  });

  it('should return 201 and json body when data is valid', async () => {
    const dto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret123',
    };
    const expectedResult = {
      user: { name: 'John Doe', email: 'john@example.com', createdAt: expect.any(Date), updatedAt: expect.any(Date) },
      token: 'jwt-token',
    };
    service.execute.mockResolvedValue(expectedResult as any);

    await controller.createUser(dto, res);

    expect(service.execute).toHaveBeenCalledWith(dto);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expectedResult);
  });

  it('should throw InvalidUserDataError when validation fails', async () => {
    const invalidDto = { name: '', email: 'not-an-email', password: '123' } as CreateUserDto;

    await expect(controller.createUser(invalidDto, res)).rejects.toBeInstanceOf(InvalidUserDataError);
    expect(service.execute).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
