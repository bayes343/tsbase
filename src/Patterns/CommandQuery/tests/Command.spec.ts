import { Command } from '../Command';

describe('Command', () => {
  let classUnderTest: Command;

  beforeEach(() => {
    classUnderTest = new Command(() => null);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should successfully execute the given command', () => {
    expect(classUnderTest.Execute().IsSuccess).toBeTruthy();
  });

  it('should return the error with a failed result if an exception is thrown', () => {
    classUnderTest = new Command(() => { throw new Error('test'); });

    const result = classUnderTest.Execute();

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain('test');
  });

});
