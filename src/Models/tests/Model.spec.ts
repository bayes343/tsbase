import { Model } from '../Model';
import { Label, Options, Required, Range, RegExp, StringLength } from '../Metadata';
import { Strings } from '../../System/Strings';
import { Regex } from '../../System/Regex';

enum Genders {
  Male = 'male',
  Female = 'female'
}

class ModelTest extends Model {
  @Label('full name')
  @Required()
  public Name = '';

  @Range(0, 120)
  public Age = 0;

  @Options({
    male: 'Male',
    female: 'Female'
  })
  public Gender: Genders = Genders.Male;

  @Required()
  @RegExp(Regex.Email, 'Must be a valid email address')
  public Email: string = 'some@email.com';

  @RegExp(Regex.Email)
  public SecondaryEmail: string = '';

  @StringLength(1, 100)
  public Notes = Strings.Space;
}

describe('Model', () => {
  const classUnderTest = new ModelTest();

  it('should get label when one is declared', () => {
    expect(classUnderTest.LabelFor<ModelTest>(l => l.Name)).toEqual('full name');
  });

  it('should return key for label when no label is declared', () => {
    expect(classUnderTest.LabelFor<ModelTest>(l => l.Age)).toEqual('Age');
  });

  it('should get options when they are declared', () => {
    expect(classUnderTest.OptionsFor<ModelTest>(l => l.Gender)).toEqual({
      male: 'Male',
      female: 'Female'
    });
  });

  it('should return an empty object for options when none are declared', () => {
    expect(classUnderTest.OptionsFor<ModelTest>(l => l.Name)).toEqual({});
  });

  it('should validate a single field on the model', () => {
    const falsyValidation = classUnderTest.Validate<ModelTest>(m => m.Name);
    expect(falsyValidation.IsSuccess).toBeFalsy();

    classUnderTest.Name = 'Some name';
    const truthyValidation = classUnderTest.Validate<ModelTest>(m => m.Name);
    expect(truthyValidation.IsSuccess).toBeTruthy();
  });

  it('should validate the model based on all declared validations', () => {
    classUnderTest.Name = 'valid name';
    const result = classUnderTest.Validate();
    expect(result.IsSuccess).toBeTruthy();
  });

  class InnerDataModel extends Model {
    @Required()
    public InnerName = Strings.Empty;
  }

  class OuterDataModel extends Model {
    public InnerDataModel = new InnerDataModel();

    public InnerDataModelArray = [new InnerDataModel(true)];
  }

  it('should validate for nested objects and return errors for those nested objects', () => {
    const outerClass = new OuterDataModel();
    const result = outerClass.Validate();
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should validate for nested objects and return success for those nested objects', () => {
    const outerClass = new OuterDataModel();
    outerClass.InnerDataModel.InnerName = 'test';

    const result = outerClass.Validate();

    expect(result.IsSuccess).toBeTruthy();
  });

  it('should validate for nested object arrays and return errors for those nested objects', () => {
    const outerClass = new OuterDataModel();
    outerClass.InnerDataModel.InnerName = 'test';
    outerClass.InnerDataModelArray.push(new InnerDataModel());

    const result = outerClass.Validate();

    expect(result.IsSuccess).toBeFalsy();
  });

  it('should validate for nested object arrays and return success when valid', () => {
    const outerClass = new OuterDataModel();
    outerClass.InnerDataModel.InnerName = 'test';
    outerClass.InnerDataModelArray.push(outerClass.InnerDataModel);

    const result = outerClass.Validate();

    expect(result.IsSuccess).toBeTruthy();
  });

  it('should return success when validating a field with no validations', () => {
    const result = classUnderTest.Validate<ModelTest>(m => m.Notes);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should validate a range when the range is valid', () => {
    const result = classUnderTest.Validate<ModelTest>(m => m.Age);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should validate a range when the range restricted value is too small', () => {
    classUnderTest.Age = -1;
    const result = classUnderTest.Validate<ModelTest>(m => m.Age);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should validate a range when the range restricted value is too large', () => {
    classUnderTest.Age = 121;
    const result = classUnderTest.Validate<ModelTest>(m => m.Age);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should validate a regexp when the value conforms', () => {
    classUnderTest.Email = 'test@email.com';
    const result = classUnderTest.Validate<ModelTest>(m => m.Email);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should validate a regexp when the value does not conform and a custom error message is declared', () => {
    classUnderTest.Email = 'test email dot com';
    const result = classUnderTest.Validate<ModelTest>(m => m.Email);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should validate a regexp when the value does not conform and no custom error message is declared', () => {
    classUnderTest.SecondaryEmail = 'test email dot com';
    const result = classUnderTest.Validate<ModelTest>(m => m.SecondaryEmail);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should validate a string length when the length of the value is within the min/max', () => {
    classUnderTest.Notes = 'notes';
    const result = classUnderTest.Validate<ModelTest>(m => m.Notes);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should validate a string length when the length of the value is below the min', () => {
    classUnderTest.Notes = Strings.Empty;
    const result = classUnderTest.Validate<ModelTest>(m => m.Notes);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should validate a string length when the length of the value is above the max', () => {
    // eslint-disable-next-line max-len
    classUnderTest.Notes = '1234567891123456789112345678911234567891123456789112345678911234567891123456789112345678911234567891123456789112345678911234567891';
    const result = classUnderTest.Validate<ModelTest>(m => m.Notes);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should validate an invalid option', () => {
    classUnderTest.Gender = 'fake' as Genders;
    const result = classUnderTest.Validate<ModelTest>(m => m.Gender);
    expect(result.IsSuccess).toBeFalsy();
  });
});