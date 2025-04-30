import { Test, TestingModule } from '@nestjs/testing';
import { GetUrlService } from './get-url.service';

describe('GetUrlService', () => {
  let service: GetUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetUrlService],
    }).compile();

    service = module.get<GetUrlService>(GetUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
