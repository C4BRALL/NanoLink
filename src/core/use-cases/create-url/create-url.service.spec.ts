import { Test, TestingModule } from '@nestjs/testing';
import { CreateUrlService } from './create-url.service';

describe('CreateUrlService', () => {
  let service: CreateUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUrlService],
    }).compile();

    service = module.get<CreateUrlService>(CreateUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
