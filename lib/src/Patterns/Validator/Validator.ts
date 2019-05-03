import { Result } from '../Result/Result';
import { IValidation } from './IValidation';

export class Validator<T> {
  private validations: Array<IValidation<T>>;

  constructor(validations: Array<IValidation<T>>) {
    this.validations = validations;
  }

  public Validate(object: T): Result {
    const result = new Result();

    this.validations.forEach(validation => {
      result.ErrorMessages = result.ErrorMessages.concat(
        validation.Validate(object).ErrorMessages);
    });

    return result;
  }
}
