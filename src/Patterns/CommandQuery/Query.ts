import { IQuery } from './IQuery';
import { Result } from '../Result/Result';
import { Logger, LogEntry, LogLevel } from '../../Utility/Logger/module';

export class Query<T> implements IQuery<T> {
  constructor(public Query: () => T) { }

  public Execute(): Result<T> {
    const result = new Result<T>();

    try {
      result.Value = this.Query();
    } catch (error: any) {
      result.ErrorMessages.push(error.message);
      Logger.Instance.Log(new LogEntry(error.message, LogLevel.Error, error));
    }

    return result;
  }
}
