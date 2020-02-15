import { ICommand } from './ICommand';
import { Result } from '../Result/Result';

/**
 * Wraps a void function returning a `Result`
 */
export class Command implements ICommand {
  constructor(public Command: () => void) { }

  /**
   * Executes a command returning a `Result`, capturing any errors as `ErrorMessages`
   */
  public Execute(): Result {
    const result = new Result();

    try {
      this.Command();
    } catch (error) {
      result.ErrorMessages.push(error.message);
    }

    return result;
  }
}
