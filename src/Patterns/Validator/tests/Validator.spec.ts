import { IValidation } from '../IValidation';
import { Validator } from '../Validator';
import { Result } from '../../Result/Result';
import { Strings } from '../../../System/Strings';

class Person {
  constructor(
    public Name: string,
    public Age: number
  ) { }
}

class NameValidation implements IValidation<Person> {
  Validate(object: Person): Result<null> {
    const result = new Result(null);
    const nameValid = object.Name && object.Name.length >= 1;

    if (!nameValid) {
      result.ErrorMessages.push('Invalid name - must be at least one character');
    }

    return result;
  }
}

class AgeValidation implements IValidation<Person> {
  Validate(object: Person): Result<null> {
    const result = new Result(null);
    const ageValid = object.Age && object.Age >= 0;

    if (!ageValid) {
      result.ErrorMessages.push('Invalid age - must be greater than or equal to one');
    }

    return result;
  }
}

describe('Validator', (() => {
  let validator: Validator<Person>;

  beforeEach(() => {
    validator = new Validator<Person>([
      new NameValidation(),
      new AgeValidation()
    ]);
  });

  it('should construct empty validator', () => {
    expect(new Validator()).toBeDefined();
  });

  it('should return successful response when no errors are detected', () => {
    const person = new Person('Joey Bayes', 28);

    const validationResult = validator.Validate(person);

    expect(validationResult.IsSuccess).toBeTruthy();
    expect(validationResult.ErrorMessages.length).toEqual(0);
  });

  it('should return failed result when one or more errors are detected', () => {
    const person = new Person(Strings.Empty, -1);

    const validationResult = validator.Validate(person);

    expect(validationResult.IsSuccess).toBeFalsy();
    expect(validationResult.ErrorMessages.length).toEqual(2);
  });

}));
