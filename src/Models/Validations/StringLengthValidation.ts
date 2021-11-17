import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Command } from '../../Patterns/CommandQuery/Command';
import { Model } from '../Model';

export class StringLengthValidation implements IValidation<Model> {
  constructor(
    private member: string,
    private minimum: number,
    private maximum: number,
    private customErrorMessage?: string
  ) { }

  public Validate(object: Model): Result {
    return new Command(() => {
      const value = (object as any)[this.member];

      const valueIsString = typeof value === 'string';
      const valueWithinRange = valueIsString &&
        value.length >= this.minimum && value.length <= this.maximum;

      if (!valueWithinRange) {
        const label = object.LabelFor(this.member);
        throw new Error(this.customErrorMessage ||
          `\"${label}\" length must be within ${this.minimum} and ${this.maximum} characters.`);
      }
    }).Execute();

  }
}
