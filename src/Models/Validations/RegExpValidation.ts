import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Command } from '../../Patterns/CommandQuery/Command';
import { Model } from '../Model';

export class RegExpValidation<T> implements IValidation<Model<T>> {
  constructor(
    private member: string,
    private regex: RegExp,
    private customErrorMessage?: string
  ) { }

  public Validate(object: Model<T>): Result {
    return new Command(() => {
      const value = (object as any)[this.member];

      const regex = new RegExp(this.regex);
      const regexTestPasses = regex.test(value);

      if (
        !!value && // don't enforce if falsy - leave that to required validation
        !regexTestPasses
      ) {
        const label = object.LabelFor(this.member);
        throw new Error(this.customErrorMessage || `${label} value: ${value} does not conform to the expected regular expression: ${regex}`);
      }
    }).Execute();
  }
}
