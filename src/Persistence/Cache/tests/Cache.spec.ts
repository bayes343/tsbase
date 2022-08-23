import { TestHelpers } from 'tsmockit';
import { ICache } from '../ICache';
import { Cache } from '../Cache';
import { InMemoryStorage } from '../../GenericStorage/InMemoryStorage';
import { IGenericStorage } from '../../GenericStorage/IGenericStorage';
import { JsonSerializer } from '../../../Utility/Serialization/JsonSerializer';

const testValue = 'test';

describe('Cache', () => {
  let classUnderTest: ICache<any>;
  let cacheLife: number | ((entry: any) => boolean) = 0;
  const genericStorage: IGenericStorage = new InMemoryStorage();
  const serializer = new JsonSerializer();

  beforeEach(() => {
    classUnderTest = new Cache<any>(genericStorage, cacheLife, serializer);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new Cache(genericStorage)).toBeDefined();
  });

  it('should add item to cache', () => {
    const result = classUnderTest.Add(testValue, testValue);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should delete item from cache', () => {
    classUnderTest.Add(testValue, testValue);
    const result = classUnderTest.Delete(testValue);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should get cached item', () => {
    classUnderTest.Add(testValue, testValue);
    const result = classUnderTest.Get(testValue);
    expect(result).toEqual(testValue);
  });

  it('should return null when getting an item that is not cached', () => {
    const result = classUnderTest.Get('fake');
    expect(result).toBeNull();
  });

  it('should return null for a cached item that has expired due to time', async () => {
    cacheLife = 1;
    classUnderTest = new Cache<any>(genericStorage, cacheLife, serializer);
    classUnderTest.Add(testValue, testValue);

    const resultIsNull = await TestHelpers.TimeLapsedCondition(() => {
      const result = classUnderTest.Get(testValue);
      return result === null;
    });

    expect(resultIsNull).toBeTruthy();
  });

  it('should return the cached value for a cached item that has NOT expired due to time', async () => {
    classUnderTest = new Cache<any>(genericStorage, 10000, serializer);
    classUnderTest.Add(testValue, testValue);

    const resultIsNotNull = await TestHelpers.TimeLapsedCondition(() => {
      const result = classUnderTest.Get(testValue);
      return result === testValue;
    });

    expect(resultIsNotNull).toBeTruthy();
  });

  it('should return null for a cached item that has expired due to a custom predicate', () => {
    classUnderTest = new Cache<any>(genericStorage, () => false, serializer);
    classUnderTest.Add(testValue, testValue);

    const result = classUnderTest.Get(testValue);

    expect(result).toBeNull();
  });
});
