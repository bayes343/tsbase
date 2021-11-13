import { Model } from '../Model';
import { Label } from '../Decorators/Label';
import { InputTypes } from '../InputTypes';
import { Input } from '../Decorators/Input';

class ModelTest extends Model {
  @Label('full name')
  public Name = '';

  @Input(InputTypes.Number)
  public Age = 0;
}

describe('Model', () => {
  const classUnderTest = new ModelTest();

  it('should get label when one is declared', () => {
    expect(classUnderTest.Label<ModelTest>(l => l.Name)).toEqual('full name');
  });

  it('should return key for label when no label is declared', () => {
    expect(classUnderTest.Label<ModelTest>(l => l.Age)).toEqual('Age');
  });

  it('should get input when one is declared', () => {
    expect(classUnderTest.Input<ModelTest>(l => l.Age)).toEqual(InputTypes.Number);
  });

  it('should return text for input when no input is declared', () => {
    expect(classUnderTest.Input<ModelTest>(l => l.Name)).toEqual(InputTypes.Text);
  });
});
