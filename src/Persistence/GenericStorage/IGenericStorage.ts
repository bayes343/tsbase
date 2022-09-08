import { Result } from '../../Patterns/Result/Result';

export interface IGenericStorage {
  /**
   * Uses stored data to return a class instance of the type specified
   * @param type
   * @param key
   */
  Get<T>(type: { new(): T; }, key: string): Result<T>;
  /**
   * Stores the stringified version of the given object at the specified key
   * @param key
   * @param value
   */
  Set<T>(key: string, value: T): Result<null>;
  /**
   * Returns the raw data stored at the given key
   * @param key
   */
  GetValue(key: string): Result<any>;
  /**
   * Stores the raw data of the given value at the given key
   * @param key
   * @param value
   */
  SetValue(key: string, value: string): Result<null>;
  /**
   * Delete the item with the given key from storage
   * @param key
   */
  Remove(key: string): Result<null>;
}
