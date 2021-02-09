import { Result } from '../Result/Result';
import { IValidation } from './IValidation';

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

  public Validate(object: T): Result {
    const result = new Result();

    this.Validations.forEach(validation => {
      result.ErrorMessages = result.ErrorMessages.concat(
        validation.Validate(object).ErrorMessages);
    });

    return result;
  }
}
