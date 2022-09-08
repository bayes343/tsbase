import { Result } from '../Result/Result';

/**
 * Wraps a generic function returning a `Result` containing the return value of said function
 */
export interface IQuery<T> {
  Query: () => T;

  /**
   * Executes the query returning a `Result<T>` containing the query return value,
   * as well as capturing any errors as `ErrorMessages`
   */
  Execute(): Result<T>;
}
