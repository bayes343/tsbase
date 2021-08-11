import { GenericResult, Result } from '../../Patterns/module';

export interface IIndexedDb {
  /**
   * Name of the database to connect to.
   */
  Name: string;

  /**
   * Version of the database to run.
   * Migrations up to and including this version will be executed on connection.
   */
  Version: number;
  Connected: boolean;

  /**
   * Connect to the database configured by the Name and Version properties.
   */
  Connect(): Promise<GenericResult<IDBDatabase | null>>;

  /**
   * Inserts a map (storeName => object[]) of objects into the specified store(s).
   * @param insertions
   */
  Insert(insertions: Record<string, object[]>): Promise<Result>;

  /**
   * Get a record by key or records by query from a specified store
   * @param storeName
   * @param query
   */
  Get<T>(storeName: string, query: number): Promise<GenericResult<T | null>>;
  Get<T>(storeName: string, query: string): Promise<GenericResult<T | null>>;
  Get<T>(storeName: string, query: ((t: T) => boolean)): Promise<GenericResult<T[]>>;

  /**
   * Get all records from a specified store
   * @param storeName
   */
  GetAll<T>(storeName: string): Promise<GenericResult<T[]>>;

  /**
   * Updates a map (storeName => object[]) of objects in the specified store(s).
   * @param updates
   */
  Update(updates: Record<string, object[]>): Promise<Result>;

  /**
   * Deletes a map (storeName => object[]) of objects from the specified store(s).
   * @param deletions
   */
  Delete(deletions: Record<string, string[]>): Promise<Result>;

  /**
   * Close the connection to the database
   */
  Disconnect(): void;
}
