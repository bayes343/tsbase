import { IQuery } from './IQuery';
import { GenericResult } from '../Result/GenericResult';

export class Query<T> implements IQuery<T> {
  constructor(public Query: () => T) { }

  public Execute(): GenericResult<T> {
    const result = new GenericResult<T>();

    try {
      result.Value = this.Query();
    } catch (error) {
      result.ErrorMessages.push(error.message);
    }

    return result;
  }
}
