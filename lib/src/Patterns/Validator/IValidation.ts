import { Result } from '../Result/Result';

/**
 * Am interface describing a object whose purpose is to
 * validate an object and return a Result
 */
export interface IValidation<T> {
  Validate(object: T): Result;
}
