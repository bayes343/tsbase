import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Command } from '../../Patterns/CommandQuery/Command';
import { Model } from '../Model';

export class OptionValidation implements IValidation<Model> {
  constructor(
    private member: string,
    private customErrorMessage?: string
  ) { }

  public Validate(object: Model): Result {
    return new Command(() => {
      const value = (object as any)[this.member];

      const options = object.OptionsFor(this.member);
      const valueIsValidOption = !!options[value];

      if (!valueIsValidOption) {
        const label = object.LabelFor(this.member);
        throw new Error(this.customErrorMessage || `"${value}" is not a valid option for: \"${label}\".`);
      }
    }).Execute();
  }
}
