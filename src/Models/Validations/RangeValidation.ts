import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Command } from '../../Patterns/CommandQuery/Command';
import { Model } from '../Model';

export class RangeValidation implements IValidation<Model> {
  constructor(
    private member: string,
    private minimum: number,
    private maximum: number,
    private customErrorMessage?: string
  ) { }

  public Validate(object: Model): Result {
    return new Command(() => {
      const value = (object as any)[this.member];

      const valueIsNumeric = !isNaN(parseFloat(value.toString()));
      const valueWithinRange = valueIsNumeric &&
        value >= this.minimum && value <= this.maximum;

      if (!valueWithinRange) {
        const label = object.LabelFor(this.member);
        throw new Error(this.customErrorMessage ||
          `\"${label}\" must be within the range of ${this.minimum} and ${this.maximum}.`);
      }
    }).Execute();
  }
}
