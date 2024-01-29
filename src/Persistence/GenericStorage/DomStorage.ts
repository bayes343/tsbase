import { IGenericStorage } from './IGenericStorage';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { Command } from '../../Patterns/CommandQuery/Command';
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

  public Get<T>(type: { new(): T; }, key: string): Result<T | null> {
    return new Query((): T | null => {
      const value = this.getStorageMedium().getItem(key);
      if (value) {
        return this.serializer.Deserialize(type, JSON.parse(value)) as T;
      } else {
        return null;
      }
    }).Execute();
  }

  public Set<T>(key: string, value: T): Result<null> {
    return new Command(() =>
      this.getStorageMedium().setItem(key, JSON.stringify(value))).Execute();
  }

  public GetValue(key: string): Result<string | null> {
    return new Query((): string | null => {
      const value = this.getStorageMedium().getItem(key);
      if (value) {
        return value;
      } else {
        return null;
      }
    }).Execute();
  }

  public SetValue(key: string, value: string): Result<null> {
    return new Command(() =>
      this.getStorageMedium().setItem(key, value)).Execute();
  }

  public Remove(key: string): Result<null> {
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
