import { ICommand } from './ICommand';
import { Result } from '../Result/Result';
import { LogEntry, Logger, LogLevel } from '../../Utility/Logger/module';

export class Command implements ICommand {
  constructor(public Command: () => void) { }

  public Execute(): Result<null> {
    const result = new Result(null);

    try {
      this.Command();
    } catch (error: any) {
      result.ErrorMessages.push(error.message);
      Logger.Instance.Log(new LogEntry(error.message, LogLevel.Error, error));
    }

    return result;
  }
}
