import { Result } from '../../Patterns/Result/Result';
import { Command } from '../../Patterns/CommandQuery/Command';
import { Query } from '../../Patterns/CommandQuery/Query';
import { IGenericStorage } from './IGenericStorage';

/**
 * Provides a generic interface for storing values in an in-memory Map object
 */
export class InMemoryStorage implements IGenericStorage {
  private storageMap = new Map<string, any>();

  public Get<T>(_type: new () => T, key: string): Result<T | null> {
    return this.GetValue(key);
  }

  public Set<T>(key: string, value: T): Result<null> {
    return new Command(() => {
      this.storageMap.set(key, value);
    }).Execute();
  }

  public GetValue<T>(key: string): Result<T | null> {
    return new Query((): any => {
      const value = this.storageMap.get(key);
      if (value) {
        return value;
      } else {
        return null;
      }
    }).Execute();
  }

  public SetValue(key: string, value: string): Result<null> {
    return this.Set(key, value);
  }

  public Remove(key: string): Result<null> {
    return new Command(() =>
      this.storageMap.delete(key)).Execute();
  }
}
