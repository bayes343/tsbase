import { IGenericStorage } from './IGenericStorage';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { Command } from '../../Patterns/CommandQuery/Command';
import { GenericResult } from '../../Patterns/Result/GenericResult';
import { Result } from '../../Patterns/Result/Result';
import { Query } from '../../Patterns/CommandQuery/Query';

export enum DomStorageMode {
  Session,
  Local
}

/**
 * Provides a generic interface for interacting with DomStorage
 */
export class DomStorage implements IGenericStorage {
  constructor(
    private storageMode: DomStorageMode,
    private serializer = new JsonSerializer()
  ) { }

  public Get<T>(type: { new(): T; }, key: string): GenericResult<T> {
    return new Query((): T => {
      const value = this.getStorageMedium().getItem(key);
      if (value) {
        return this.serializer.Serialize(type, JSON.parse(value)) as T;
      } else {
        throw new Error(`Unable to retrieve \"${key}\"`);
      }
    }).Execute();
  }

  public Set<T>(key: string, value: T): Result {
    return new Command(() =>
      this.getStorageMedium().setItem(key, JSON.stringify(value))).Execute();
  }

  public GetValue<T>(key: string): GenericResult<T> {
    return new Query((): any => {
      const value = this.getStorageMedium().getItem(key);
      if (value) {
        return value;
      } else {
        throw new Error(`Unable to retrieve \"${key}\"`);
      }
    }).Execute();
  }

  public SetValue(key: string, value: string): Result {
    return new Command(() =>
      this.getStorageMedium().setItem(key, value)).Execute();
  }

  public Remove(key: string): Result {
    return new Command(() =>
      this.getStorageMedium().removeItem(key)).Execute();
  }

  private getStorageMedium(): Storage {
    if (this.storageMode === DomStorageMode.Local) {
      return window.localStorage;
    } else {
      return window.sessionStorage;
    }
  }
}
