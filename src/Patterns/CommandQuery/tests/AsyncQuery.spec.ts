import { AsyncQuery } from '../AsyncQuery';

describe('AsyncQuery', () => {
  let classUnderTest: AsyncQuery<string>;

  beforeEach(() => {
    classUnderTest = new AsyncQuery(async () => 'test');
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should successfully execute the given async query', async () => {
    const result = await classUnderTest.Execute();
    expect(result.Value).toEqual('test');
  });

  it('should return the error with a failed result if an exception is thrown', async () => {
    classUnderTest = new AsyncQuery(() => { throw new Error('test'); });

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain('test');
  });
});
