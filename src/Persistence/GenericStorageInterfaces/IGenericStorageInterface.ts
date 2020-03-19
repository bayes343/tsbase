import { Result } from '../../Patterns/Result/Result';
import { GenericResult } from '../../Patterns/Result/GenericResult';

export interface IGenericStorageInterface {
  Get<T>(type: { new(): T; }, key: string): GenericResult<T>;
  Set<T>(key: string, value: T): Result;
  GetValue(key: string): GenericResult<any>;
  SetValue(key: string, value: string): Result;
  Remove(key: string): Result;
}
