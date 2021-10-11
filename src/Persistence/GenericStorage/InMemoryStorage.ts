import { GenericResult, Result } from '../../Patterns/Result/module';
import { Command } from '../../Patterns/CommandQuery/Command';
import { Query } from '../../Patterns/CommandQuery/Query';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { IGenericStorage } from './IGenericStorage';

export class InMemoryStorage implements IGenericStorage {
  private storageMap = new Map<string, any>();

  constructor(
    private serializer = new JsonSerializer()
  ) { }

  public Get<T>(type: new () => T, key: string): GenericResult<T> {
    return new Query((): T => {
      const value = this.storageMap.get(key);
      if (value) {
        return this.serializer.Serialize(type, JSON.parse(value)) as T;
      } else {
        throw new Error(`Unable to retrieve \"${key}\"`);
      }
    }).Execute();
  }

  public Set<T>(key: string, value: T): Result {
    return new Command(() => {
      this.storageMap.set(key, value);
    }).Execute();
  }

  public GetValue(key: string): GenericResult<any> {
    return new Query((): any => {
      const value = this.storageMap.get(key);
      if (value) {
        return value;
      } else {
        throw new Error(`Unable to retrieve \"${key}\"`);
      }
    }).Execute();
  }

  public SetValue(key: string, value: string): Result {
    return new Command(() =>
      this.storageMap.set(key, value)).Execute();
  }

  public Remove(key: string): Result {
    return new Command(() =>
      this.storageMap.delete(key)).Execute();
  }
}
