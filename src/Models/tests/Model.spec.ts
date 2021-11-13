import { Model } from '../Model';
import { Label } from '../Decorators/Label';
import { InputTypes } from '../InputTypes';
import { Input } from '../Decorators/Input';
import { Options } from '../Decorators/Options';

enum Genders {
  Male = 'male',
  Female = 'female'
}

class ModelTest extends Model {
  @Label('full name')
  public Name = '';

  @Input(InputTypes.Number)
  public Age = 0;

  @Options({
    male: 'Male',
    female: 'Female'
  })
  public Gender: Genders = Genders.Male;
}

describe('Model', () => {
  const classUnderTest = new ModelTest();

  it('should get label when one is declared', () => {
    expect(classUnderTest.LabelFor<ModelTest>(l => l.Name)).toEqual('full name');
  });

  it('should return key for label when no label is declared', () => {
    expect(classUnderTest.LabelFor<ModelTest>(l => l.Age)).toEqual('Age');
  });

  it('should get input when one is declared', () => {
    expect(classUnderTest.InputFor<ModelTest>(l => l.Age)).toEqual(InputTypes.Number);
  });

  it('should return text for input when no input is declared', () => {
    expect(classUnderTest.InputFor<ModelTest>(l => l.Name)).toEqual(InputTypes.Text);
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
});
