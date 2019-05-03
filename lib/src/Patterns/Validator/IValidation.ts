import { Result } from '../Result/Result';

export interface IValidation<T> {
  Validate(object: T): Result;
}
