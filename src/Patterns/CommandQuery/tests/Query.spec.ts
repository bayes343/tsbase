import { Query } from '../Query';

describe('Query', () => {
  let classUnderTest: Query<string>;

  beforeEach(() => {
    classUnderTest = new Query(() => 'test');
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should successfully execute the given Query', () => {
    expect(classUnderTest.Execute().Value).toEqual('test');
  });

  it('should return the error with a failed result if an exception is thrown', () => {
    classUnderTest = new Query(() => { throw new Error('test'); });

    const result = classUnderTest.Execute();

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages.indexOf('test') >= 0).toBeTruthy();
  });
});
