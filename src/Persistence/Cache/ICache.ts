import { Result } from '../../Patterns/Result/Result';

/**
 * An abstraction for prioritizing performance over data "freshness"
 */
export interface ICache<T> {
  /**
   * Add an entry to the cache at a the given key
   * @param key
   * @param value
   */
  Add(key: string, value: T): Result;
  /**
   * Get the value cached at the given key | returns null when there is no value for the given key
   * @param type
   * @param key
   */
  Get(key: string, type?: { new(): T; }): T | null;
  /**
   * Delete the cached entry at the given key | is safe to call when no entry for the given key exists
   * @param key
   */
  Delete(key: string): Result;
}
