import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { urlEntitySchema } from 'src/core/domain/validations/url.entity.schema';
import { date, z, ZodError } from 'zod';

describe('UrlEntity', () => {
  let urlStub: UrlEntity;
  const expectedCreatedAt = Date.now();
  const mockDate1 = new Date('2025-05-05T10:00:00Z');
  const mockDate2 = new Date('2025-05-05T10:01:00Z');
  const originalDate = global.Date;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);
    urlStub = new UrlEntity({
      id: 'a4de3c9d-88e1-4c82-b34d-ee94b24e2084',
      shortCode: 'short1',
      originalUrl: 'https://www.google.com',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      clickCount: 1,
    });
    global.Date = originalDate;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when creating a new UrlEntity with invalid data', () => {
    const invalidData = {
      id: 'a4de3c9d-88e1-4c82-b34d-ee94b24e2084',
      shortCode: '',
      originalUrl: 'not-a-valid-url',
      userId: 'invalid-user-id',
    };

    expect(() => new UrlEntity(invalidData)).toThrow(ZodError);
  });

  it('should provide specific error messages for invalid fields', () => {
    try {
      new UrlEntity({
        id: 'a4de3c9d-88e1-4c82-b34d-ee94b24e2084',
        shortCode: '',
        originalUrl: 'not-a-valid-url',
        userId: 'invalid-user-id',
        clickCount: -1,
      });
      fail('Expected ZodError to be thrown');
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.format();
        type FormattedErrors = z.inferFormattedError<typeof urlEntitySchema>;

        expect((formattedErrors as FormattedErrors).originalUrl?._errors).toBeDefined();
        expect((formattedErrors as FormattedErrors).shortCode?._errors).toBeDefined();
        expect((formattedErrors as FormattedErrors).userId?._errors).toBeDefined();
        expect((formattedErrors as FormattedErrors).clickCount?._errors).toBeDefined();
      } else {
        fail('Expected ZodError to be thrown');
      }
    }
  });

  it('Should create a new UrlEntity with valid data with userId', () => {
    const validData = {
      id: 'a4de3c9d-88e1-4c82-b34d-ee94b24e2084',
      shortCode: 'short1',
      originalUrl: 'https://www.google.com',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      clickCount: 1,
      createdAt: new Date(expectedCreatedAt),
      lastClickDate: new Date(),
    };

    const url = new UrlEntity(validData);

    expect(url.id).toBe(validData.id);
    expect(url.shortCode).toBe(validData.shortCode);
    expect(url.originalUrl).toBe(validData.originalUrl);
    expect(url.userId).toBe(validData.userId);
    expect(url.clickCount).toBe(validData.clickCount);
    expect(url.createdAt).toStrictEqual(validData.createdAt);
    expect(url.lastClickDate).toStrictEqual(validData.lastClickDate);
  });

  it('Should create a new UrlEntity with valid data without userId', () => {
    const validData = {
      id: 'a4de3c9d-88e1-4c82-b34d-ee94b24e2084',
      shortCode: 'short1',
      originalUrl: 'https://www.google.com',
      clickCount: 1,
      createdAt: new Date(expectedCreatedAt),
      lastClickDate: new Date(),
    };

    const url = new UrlEntity(validData);

    expect(url.userId).toBeUndefined();
    expect(url.id).toBe(validData.id);
    expect(url.shortCode).toBe(validData.shortCode);
    expect(url.originalUrl).toBe(validData.originalUrl);
    expect(url.clickCount).toBe(validData.clickCount);
    expect(url.createdAt).toStrictEqual(validData.createdAt);
    expect(url.lastClickDate).toStrictEqual(validData.lastClickDate);
  });

  it('Should increment the click count', () => {
    global.Date = jest.fn(() => mockDate1) as any;
    global.Date.now = jest.fn(() => mockDate1.getTime());

    global.Date = jest.fn(() => mockDate2) as any;
    global.Date.now = jest.fn(() => mockDate2.getTime());
    
    urlStub.incrementClickCount();
    
    expect(urlStub.clickCount).toBe(2);
    expect(urlStub.lastClickDate).toEqual(mockDate2);
    expect(urlStub.updatedAt).toEqual(mockDate2);
  });

  it('Should soft delete the UrlEntity', () => {
    global.Date = jest.fn(() => mockDate1) as any;
    global.Date.now = jest.fn(() => mockDate1.getTime());

    global.Date = jest.fn(() => mockDate2) as any;
    global.Date.now = jest.fn(() => mockDate2.getTime());

    urlStub.softDelete();

    expect(urlStub.deletedAt).toEqual(mockDate2);
    expect(urlStub.updatedAt).toEqual(mockDate2);
  });

  it('Should restore the UrlEntity', () => {
    global.Date = jest.fn(() => mockDate2) as any;
    global.Date.now = jest.fn(() => mockDate2.getTime());

    urlStub.restore();

    expect(urlStub.deletedAt).toBeUndefined();
    expect(urlStub.updatedAt).toEqual(mockDate2);
  });
  
  it('Should update the UrlEntity', () => {
    global.Date = jest.fn(() => mockDate2) as any;
    global.Date.now = jest.fn(() => mockDate2.getTime());

    urlStub.update('https://www.google.com/updated');

    expect(urlStub.originalUrl).toBe('https://www.google.com/updated');
    expect(urlStub.updatedAt).toEqual(mockDate2);
  });

  it('Should check if the UrlEntity is deleted', () => {
    urlStub.softDelete();

    expect(urlStub.isDeleted()).toBe(true);
  });  
});
