import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Model } from '../Model';

export class RequiredValidation implements IValidation<Model> {
  constructor(
    private member: string
  ) { }

  public Validate(object: Model): Result {
    const label = object.LabelFor(this.member);

    const result = new Result();
    const valueExists = (object as any)[this.member] && (object as any)[this.member]
      .toString().trim().length >= 1;

    if (!valueExists) {
      result.ErrorMessages.push(`\"${label ? label : this.member}\" is a required field.`);
    }

    return result;
  }
}
