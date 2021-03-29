import { AsyncCommand } from '../AsyncCommand';

describe('AsyncCommand', () => {
  let classUnderTest: AsyncCommand;

  beforeEach(() => {
    classUnderTest = new AsyncCommand(async () => { });
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should successfully execute the given async command', async () => {
    const result = await classUnderTest.Execute();
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should return the error with a failed result if an exception is thrown', async () => {
    classUnderTest = new AsyncCommand(() => { throw new Error('test'); });

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages.indexOf('test') >= 0).toBeTruthy();
  });
});
