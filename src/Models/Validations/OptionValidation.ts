import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Model } from '../Model';

export class OptionValidation implements IValidation<Model> {
  constructor(
    private member: string,
    private customErrorMessage?: string
  ) { }

  public Validate(object: Model): Result {
    const label = object.LabelFor(this.member);

    const result = new Result();
    const value = (object as any)[this.member];

    const options = object.OptionsFor(this.member);
    const valueIsValidOption = !!options[value];

    if (!valueIsValidOption) {
      result.ErrorMessages.push(this.customErrorMessage || `"${value}" is not a valid option for: \"${label ? label : this.member}\".`);
    }

    return result;
  }
}
