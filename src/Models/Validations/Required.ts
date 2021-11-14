import { Result } from '../../Patterns/Result/Result';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Model } from '../Model';

export class Required<T> implements IValidation<Model> {
  constructor(
    private member: (func: T) => any
  ) { }

  public Validate(object: Model): Result {
    const key = Model.GetKeyFromMemberFunc(this.member);
    const label = object.LabelFor(this.member);

    const result = new Result();
    const valueExists = (object as any)[key] && (object as any)[key]
      .toString().trim().length >= 1;

    if (!valueExists) {
      result.ErrorMessages.push(`\"${label ? label : key}\" is a required field.`);
    }

    return result;
  }
}
