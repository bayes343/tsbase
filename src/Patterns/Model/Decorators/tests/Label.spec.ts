import { Model } from '../../Model';
import { Label } from '../Label';

class LabelTest extends Model {
  @Label('full name')
  public Name = '';
  public Age = 0;
}

describe('Label', () => {
  const labelTestInstance = new LabelTest();

  it('should get label when one is declared', () => {
    expect(labelTestInstance.GetLabel('Name')).toEqual('full name');
  });

  it('should return key for get label when no label is declared', () => {
    expect(labelTestInstance.GetLabel('Age')).toEqual('Age');
  });
});
