import { IGenericStorageInterface } from './IGenericStorageInterface';
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
export class DomStorageInterface implements IGenericStorageInterface {
  constructor(
    private storageMode: DomStorageMode,
    private serializer = new JsonSerializer()
  ) { }

  /**
   * Uses stored data to return a class instance of the type specified
   * @param type
   * @param key
   */
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

  /**
   * Stores the stringified version of the given object at the specified key
   * @param key
   * @param value
   */
  public Set<T>(key: string, value: T): Result {
    return new Command(() =>
      this.getStorageMedium().setItem(key, JSON.stringify(value))).Execute();
  }

  /**
   * Returns the raw data stored at the given key
   * @param key
   */
  public GetValue(key: string): GenericResult<any> {
    return new Query((): any => {
      const value = this.getStorageMedium().getItem(key);
      if (value) {
        return value;
      } else {
        throw new Error(`Unable to retrieve \"${key}\"`);
      }
    }).Execute();
  }

  /**
   * Stores the raw data of the given value at the given key
   * @param key
   * @param value
   */
  public SetValue(key: string, value: string): Result {
    return new Command(() =>
      this.getStorageMedium().setItem(key, value)).Execute();
  }

  /**
   * Removes the stored value at the given key
   * @param key
   */
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
