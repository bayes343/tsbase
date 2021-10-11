/**
 * The interface provided by objects that can handle basic persistence,
 * retrieval, and deletion of data in any given data store
 */
export interface IPersister<T> {
  /**
   * Retrieves previously persisted data as an array of objects
   */
  Retrieve(): Array<T>;
  /**
   * Handles persisting the given array of objects
   */
  Persist(items: Array<T>): void;
  /**
   * Deletes all previously persisted data
   */
  Purge(): void;
}
