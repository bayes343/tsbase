import { IGenericStorage } from '../../Persistence/GenericStorage/IGenericStorage';
import { Query } from '../../Patterns/CommandQuery/Query';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { CacheEntry } from './CacheEntry';
import { ICache } from './ICache';

export class Cache<T> implements ICache<T> {
  constructor(
    private storage: IGenericStorage,
    private cacheLife = 0,
    private serializer = new JsonSerializer()
  ) { }

  public Add(key: string, value: T): void {
    const cacheEntry: CacheEntry<T> = {
      value: value,
      expiration: this.cacheLife ? Date.now() + this.cacheLife : 0
    };

    this.Delete(key);
    this.storage.Set(key, cacheEntry);
  }

  public Get(type: { new(): T; }, key: string): T | null {
    return new Query<T | null>(() => {
      const result = this.storage.GetValue(key);

      const cacheValue = () => {
        if (
          result.IsSuccess &&
          (!result.Value?.expiration || result.Value?.expiration > Date.now())
        ) {
          return this.serializer.Serialize(type, result.Value?.value);
        } else {
          this.Delete(key);
          return null;
        }
      };

      return cacheValue();
    }).Execute().Value as T | null;
  }

  public Delete(key: string): void {
    this.storage.Remove(key);
  }
}
