import { Test, TestingModule } from '@nestjs/testing';
import { UrlRepositoryService } from './url-repository.service';

describe('UrlRepositoryService', () => {
  let service: UrlRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlRepositoryService],
    }).compile();

    service = module.get<UrlRepositoryService>(UrlRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
