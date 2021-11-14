import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Model } from '../Model';

export class StringLengthValidation implements IValidation<Model> {
  constructor(
    private member: string,
    private minimum: number,
    private maximum: number,
    private customErrorMessage?: string
  ) { }

  public Validate(object: Model): Result {
    const result = new Result();

    const label = object.LabelFor(this.member);
    const value = (object as any)[this.member];

    const valueIsString = typeof value === 'string';
    const valueWithinRange = valueIsString &&
      value.length >= this.minimum && value.length <= this.maximum;

    if (!valueWithinRange) {
      result.ErrorMessages.push(this.customErrorMessage ||
        `\"${label ? label : this.member}\" length must be within ${this.minimum} and ${this.maximum} characters.`);
    }

    return result;
  }
}
