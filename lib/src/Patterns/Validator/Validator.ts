import { Result } from '../Result/Result';
import { IValidation } from './IValidation';

/**
 * Abstracts the responsibilities of ascertaining whether
 * object passes a given set of validations
 */
export class Validator<T> {
  /**
   * The set of validations the Validator calls when constructing its
   * overall validation result.
   */
  public Validations: Array<IValidation<T>>;

  constructor(
    validations: Array<IValidation<T>> = []
  ) {
    this.Validations = validations;
  }

  /**
   * Returns the aggregate result of all given validations
   * @param object
   */
  public Validate(object: T): Result {
    const result = new Result();

    this.Validations.forEach(validation => {
      result.ErrorMessages = result.ErrorMessages.concat(
        validation.Validate(object).ErrorMessages);
    });

    return result;
  }
}
