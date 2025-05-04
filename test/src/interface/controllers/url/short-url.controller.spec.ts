import { GetUrlByShortCodeService } from 'src/core/use-cases/url/get-url-by-shortcode.service';
import { ShortUrlController } from 'src/interface/controllers/url/short-url.controller';

describe('ShortUrlController', () => {
  const expectedCreatedAt = Date.now();
  let _shortUrlController: ShortUrlController;
  let _getUrlByShortCodeService: GetUrlByShortCodeService;
  const executeMock = jest.fn();

  beforeEach(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);
    jest.spyOn(console, 'info').mockImplementation(() => ({ log: jest.fn() }) as any);

    _getUrlByShortCodeService = {
      execute: executeMock,
    } as unknown as GetUrlByShortCodeService;

    _shortUrlController = new ShortUrlController(_getUrlByShortCodeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return a url by short code', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn(),
    };

    executeMock.mockResolvedValue({
      id: 'abc123',
      shortCode: '123456',
      originalUrl: 'https://www.exemplo.com.br',
      clickCount: 0,
      incrementClickCount: jest.fn(),
    });

    await _shortUrlController.urlShortCode('123456', mockResponse as any);

    expect(mockResponse.redirect).toHaveBeenCalledWith('https://www.exemplo.com.br');
    expect(executeMock).toHaveBeenCalledWith({ shortCode: '123456' });
  });

  it('Should return a error if the url is not found', async () => {
    const invalidShortCode = '333111';
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn(),
    };

    (_getUrlByShortCodeService.execute as jest.Mock).mockResolvedValue({
      url: null,
    });

    await expect(_shortUrlController.urlShortCode(invalidShortCode, mockResponse as any)).rejects.toThrow(
      `URL with short code '${invalidShortCode}' not found`,
    );
    expect(mockResponse.redirect).not.toHaveBeenCalled();
  });
});
