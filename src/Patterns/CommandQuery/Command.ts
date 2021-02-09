import { ICommand } from './ICommand';
import { Result } from '../Result/Result';

export class Command implements ICommand {
  constructor(public Command: () => void) { }

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
