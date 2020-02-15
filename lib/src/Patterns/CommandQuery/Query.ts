import { IQuery } from './IQuery';
import { GenericResult } from '../Result/GenericResult';

/**
 * Wraps a generic function returning a `Result` containing the return value of said function
 */
export class Query<T> implements IQuery<T> {
  constructor(public Query: () => T) { }

  /**
   * Executes the query returning a `GenericResult<T>` containing the query return value, 
   * as well as capturing any errors as `ErrorMessages`
   */
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
