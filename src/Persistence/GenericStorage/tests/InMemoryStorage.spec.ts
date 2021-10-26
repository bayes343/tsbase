import { IGenericStorage } from '../IGenericStorage';
import { InMemoryStorage } from '../InMemoryStorage';

describe('InMemoryStorage', () => {
  let classUnderTest: IGenericStorage;

  beforeEach(() => {
    classUnderTest = new InMemoryStorage();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should set value to store', () => {
    const result = classUnderTest.SetValue('test', 'test');
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should get value from store', () => {
    classUnderTest.SetValue('test', 'test');
    const result = classUnderTest.GetValue('test');
    expect(result.Value).toEqual('test');
  });

  it('should get object from from store', () => {
    classUnderTest.Set('test', { key: 'value' });
    const result = classUnderTest.Get(Object, 'test');
    expect(result.Value).toEqual({ key: 'value' });
  });

  it('should report an error on getting a value for a key that is not set', () => {
    const result = classUnderTest.GetValue('fake');
    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages.length).toEqual(1);
  });

  it('should remove a stored value', () => {
    classUnderTest.SetValue('test', 'test');
    const result = classUnderTest.Remove('test');
    expect(result.IsSuccess).toBeTruthy();
  });
});
