import { GenericResult } from '../Result/GenericResult';

export interface IQuery<T> {
  Query: () => T;
  Execute(): GenericResult<T>;
}
