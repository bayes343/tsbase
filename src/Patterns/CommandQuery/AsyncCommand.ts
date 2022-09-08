import { Result } from '../Result/Result';
import { LogEntry, Logger, LogLevel } from '../../Utility/Logger/module';
import { IAsyncCommand } from './IAsyncCommand';

export class AsyncCommand implements IAsyncCommand {
  constructor(public AsyncCommand: () => Promise<void>) { }

  public async Execute(): Promise<Result<null>> {
    const result = new Result(null);

    try {
      await this.AsyncCommand();
    } catch (error: any) {
      result.ErrorMessages.push(error.message);
      Logger.Instance.Log(new LogEntry(error.message, LogLevel.Error, error));
    }

    return result;
  }
}
