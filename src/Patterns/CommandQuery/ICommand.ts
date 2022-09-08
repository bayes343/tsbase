import { Result } from '../Result/Result';

/**
 * Wraps a void function returning a `Result`
 */
export interface ICommand {
  Command: () => void;

  /**
   * Executes a command returning a `Result`, capturing any errors as `ErrorMessages`
   */
  Execute(): Result<null>;
}
