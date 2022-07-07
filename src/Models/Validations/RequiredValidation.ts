import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Command } from '../../Patterns/CommandQuery/Command';
import { Model } from '../Model';

export class RequiredValidation<T> implements IValidation<Model<T>> {
  constructor(
    private member: string,
    private customErrorMessage?: string
  ) { }

  public Validate(object: Model<T>): Result {
    return new Command(() => {
      const valueExists = (object as any)[this.member] && (object as any)[this.member]
        .toString().trim().length >= 1;

      if (!valueExists) {
        const label = object.LabelFor(this.member);
        throw new Error(this.customErrorMessage || `\"${label}\" is a required field.`);
      }
    }).Execute();
  }
}
