import { Result } from '../../Patterns/Result/Result';
import { GenericResult } from '../../Patterns/Result/GenericResult';

export interface IGenericStorage {
  /**
   * Uses stored data to return a class instance of the type specified
   * @param type
   * @param key
   */
  Get<T>(type: { new(): T; }, key: string): GenericResult<T>;
  /**
   * Stores the stringified version of the given object at the specified key
   * @param key
   * @param value
   */
  Set<T>(key: string, value: T): Result;
  /**
   * Returns the raw data stored at the given key
   * @param key
   */
  GetValue(key: string): GenericResult<any>;
  /**
   * Stores the raw data of the given value at the given key
   * @param key
   * @param value
   */
  SetValue(key: string, value: string): Result;
  /**
   * Delete the item with the given key from storage
   * @param key
   */
  Remove(key: string): Result;
}
