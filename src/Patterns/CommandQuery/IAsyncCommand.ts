import { Result } from '../Result/Result';

/**
 * Wraps an async void function returning a `Result`
 */
export interface IAsyncCommand {
  AsyncCommand: () => Promise<void>;

  /**
   * Executes an async command returning a `Result`, capturing any errors as `ErrorMessages`
   */
  Execute(): Promise<Result<null>>;
}
