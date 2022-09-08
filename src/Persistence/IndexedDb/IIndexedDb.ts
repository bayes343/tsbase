import { Result } from '../../Patterns/Result/module';

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
  Connect(): Promise<Result<IDBDatabase | null>>;

  /**
   * Inserts a map (storeName => object[]) of objects into the specified store(s).
   * @param insertions
   */
  Insert(insertions: Record<string, object[]>): Promise<Result<null>>;

  /**
   * Get a record by key or records by query from a specified store
   * @param storeName
   * @param query
   */
  Get<T>(storeName: string, query: number): Promise<Result<T | null>>;
  Get<T>(storeName: string, query: string): Promise<Result<T | null>>;
  Get<T>(storeName: string, query: ((t: T) => boolean)): Promise<Result<T[]>>;

  /**
   * Get all records from a specified store
   * @param storeName
   */
  GetAll<T>(storeName: string): Promise<Result<T[]>>;

  /**
   * Updates a map (storeName => object[]) of objects in the specified store(s).
   * @param updates
   */
  Update(updates: Record<string, object[]>): Promise<Result<null>>;

  /**
   * Deletes a map (storeName => object[]) of objects from the specified store(s).
   * @param deletions
   */
  Delete(deletions: Record<string, string[]>): Promise<Result<null>>;

  /**
   * Close the connection to the database
   */
  Disconnect(): void;
}
