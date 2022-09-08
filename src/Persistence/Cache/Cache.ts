import { IGenericStorage } from '../../Persistence/GenericStorage/IGenericStorage';
import { Query } from '../../Patterns/CommandQuery/Query';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { CacheEntry } from './CacheEntry';
import { ICache } from './ICache';
import { Result } from '../../Patterns/Result/Result';

export class Cache<T> implements ICache<T> {
  /**
   * @param storage the storage interface used to support caching
   * @param cacheLife EITHER 1.) the amount of milliseconds after the cache is created till it is invalidated |
   * leaving the default value (0) will result prevent any auto clearing of cache entries
   * OR 2.) a function defining when the cache is no longer valid; a "false" return will invalidate the cache
   * @param serializer
   */
  constructor(
    private storage: IGenericStorage,
    private cacheLife: number | ((entry: T) => boolean) = 0,
    private serializer = new JsonSerializer()
  ) { }

  public Add(key: string, value: T): Result<null> {
    const cacheEntry: CacheEntry<T> = {
      value: value,
      expiration: typeof this.cacheLife === 'number' && this.cacheLife > 0 ?
        Date.now() + this.cacheLife : 0
    };

    this.Delete(key);
    return this.storage.Set(key, cacheEntry);
  }

  public Get(key: string, type?: { new(): T; }): T | null {
    return new Query<T | null>(() => {
      const result = this.storage.GetValue(key);

      const cacheValue = () => {
        if (this.cacheIsValid(result)) {
          return type && typeof result.Value.value === 'object' ?
            this.serializer.Serialize(type, result.Value.value) :
            result.Value.value;
        } else {
          this.Delete(key);
          return null;
        }
      };

      return cacheValue();
    }).Execute().Value as T | null;
  }

  public Delete(key: string): Result<null> {
    return this.storage.Remove(key);
  }

  private cacheIsValid(result: Result<CacheEntry<T>>) {
    if (result.IsSuccess && result.Value) {
      return typeof this.cacheLife === 'function' ?
        this.cacheLife(result.Value.value) :
        (result.Value.expiration === 0 || result.Value.expiration > Date.now());
    }

    return false;
  }
}
