/**
 * The interface provided by objects that can handle basic persistence, 
 * retrieval, and deletion of data in any given data store
 */
export interface IPersistable {
  /**
   * Retrieves previously persisted data as an array of objects
   */
  Retrieve(): Array<any>;
  /**
   * Handles persisting the given array of objects
   */
  Persist(items: Array<any>): void;
  /**
   * Deletes all previously persisted data
   */
  Purge(): void;
}