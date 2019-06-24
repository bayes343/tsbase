import { Result } from '../Result/Result';

/**
 * An interface describing an object whose purpose is to
 * validate another object and return a Result
 */
export interface IValidation<T> {
  Validate(object: T): Result;
}
