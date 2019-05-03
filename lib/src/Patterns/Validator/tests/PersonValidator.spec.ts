import { IValidation } from '../IValidation';
import { Validator } from '../Validator';
import { Result } from '../../Result/Result';

class Person {
  constructor(
    public Name: string,
    public Age: number
  ) { }
}

class NameValidation implements IValidation<Person> {
  Validate(object: Person): Result {
    const result = new Result();
    const nameValid = object.Name && object.Name.length >= 1;

    if (!nameValid) {
      result.ErrorMessages.push('Invalid name - must be at least one character');
    }

    return result;
  }
}

class AgeValidation implements IValidation<Person> {
  Validate(object: Person): Result {
    const result = new Result();
    const ageValid = object.Age && object.Age >= 0;

    if (!ageValid) {
      result.ErrorMessages.push('Invalid age - must be greater than or equal to one');
    }

    return result;
  }
}

describe('PersonValidator', (() => {
  let personValidator: Validator<Person>;

  beforeEach(() => {
    personValidator = new Validator<Person>([
      new NameValidation(),
      new AgeValidation()
    ]);
  });

  it('should return successful response when no errors are detected', () => {
    const person = new Person('Joey Bayes', 28);

    const validationResult = personValidator.Validate(person);

    expect(validationResult.IsSuccess).toBeTruthy();
    expect(validationResult.ErrorMessages.length).toEqual(0);
  });

  it('should return failed result when one or more errors are detected', () => {
    const person = new Person('', -1);

    const validationResult = personValidator.Validate(person);

    expect(validationResult.IsSuccess).toBeFalsy();
    expect(validationResult.ErrorMessages.length).toEqual(2);
  });

}));
