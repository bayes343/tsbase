import { Strings } from '../../../System/Strings';
import { Label, Validation } from '../../Metadata';
import { Model } from '../../Model';
import { Required } from '../Required';

class TestDataModel extends Model {
  @Validation([Required])
  @Label('test label')
  public Name = Strings.Empty;
}

describe('Required', () => {
  let classUnderTest: Required;
  const dataModelToValidate = new TestDataModel();

  beforeEach(() => {
    classUnderTest = new Required('Name');
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should validate true when the property is not empty', () => {
    dataModelToValidate.Name = 'test';
    const result = classUnderTest.Validate(dataModelToValidate);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should validate false when the property is empty', () => {
    dataModelToValidate.Name = Strings.Empty;
    const result = classUnderTest.Validate(dataModelToValidate);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should include the given label in error messages when one is provided', () => {
    dataModelToValidate.Name = Strings.Empty;
    const result = classUnderTest.Validate(dataModelToValidate);

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages[0].includes('test label')).toBeTruthy();
  });
});
