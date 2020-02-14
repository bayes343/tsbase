import { ICommand } from './ICommand';
import { Result } from '../../public_api';

export class Command implements ICommand {
  constructor(public Command: () => any) { }

  public Execute(): Result {
    const result = new Result();

    try {
      this.Command();
    } catch (error) {
      result.ErrorMessages.push(error);
    }

    return result;
  }
}
