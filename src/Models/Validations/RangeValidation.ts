import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Model } from '../Model';

export class RangeValidation implements IValidation<Model> {
  constructor(
    private member: string,
    private minimum: number,
    private maximum: number
  ) { }

  public Validate(object: Model): Result {
    const label = object.LabelFor(this.member);

    const result = new Result();
    const value = (object as any)[this.member];
    const valueIsNumeric = parseFloat(value.toString()) !== NaN;

    const valueWithinRange = valueIsNumeric &&
      value >= this.minimum && value <= this.maximum;

    if (!valueWithinRange) {
      result.ErrorMessages.push(`\"${label ? label : this.member}\" must be within the range of ${this.minimum} and ${this.maximum}.`);
    }

    return result;
  }
}
