import { Result } from '../Result/Result';

/**
 * Abstracts the responsibilities of ascertaining whether
 * an object passes a given set of validations
 */
export interface IValidation<T> {
  /**
   * Returns the aggregate result of all given validations
   * @param object
   */
  Validate(object: T): Result<null>;
}
