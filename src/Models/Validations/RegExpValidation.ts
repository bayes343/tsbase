import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Model } from '../Model';

export class RegExpValidation implements IValidation<Model> {
  constructor(
    private member: string,
    private regex: RegExp,
    private customErrorMessage?: string
  ) { }

  public Validate(object: Model): Result {
    const result = new Result();

    const label = object.LabelFor(this.member);
    const value = (object as any)[this.member];

    const regex = new RegExp(this.regex);
    const regexTestPasses = regex.test(value);

    if (
      !!value && // don't enforce if falsy - leave that to required validation
      !regexTestPasses) {
      result.ErrorMessages.push(this.customErrorMessage || `${label} value: ${value} does not conform to the expected regular expression: ${regex}`);
    }

    return result;
  }
}
