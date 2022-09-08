import { Result } from '../Result/Result';

/**
 * Wraps a generic async function returning a `Result` containing the return value of said function
 */
export interface IAsyncQuery<T> {
  AsyncQuery: () => Promise<T>;

  /**
   * Executes the async query returning a `Result<T>` containing the query return value,
   * as well as capturing any errors as `ErrorMessages`
   */
  Execute(): Promise<Result<T>>;
}
