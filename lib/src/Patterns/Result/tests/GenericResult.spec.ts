import { GenericResult } from "../GenericResult";

describe('GenericResult', () => {
  let genericResult = new GenericResult<string>('test');

  it('should return true for IsSuccess if there are no errors', () => {
    expect(genericResult.IsSuccess).toBeTruthy();
  });

  it('should return false for IsSuccess if there are errors', () => {
    genericResult.ErrorMessages.push('test');
    expect(genericResult.IsSuccess).toBeFalsy();
  });
});
