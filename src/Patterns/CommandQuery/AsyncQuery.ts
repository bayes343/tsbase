import { GenericResult } from '../Result/GenericResult';
import { Logger, LogEntry, LogLevel } from '../../Utility/Logger/module';
import { IAsyncQuery } from './IAsyncQuery';

export class AsyncQuery<T> implements IAsyncQuery<T> {
  constructor(public AsyncQuery: () => Promise<T>) { }

  public async Execute(): Promise<GenericResult<T>> {
    const result = new GenericResult<T>();

    try {
      result.Value = await this.AsyncQuery();
    } catch (error) {
      result.ErrorMessages.push(error.message);
      Logger.Instance.Log(new LogEntry(error.message, LogLevel.Error, error));
    }

    return result;
  }
}
