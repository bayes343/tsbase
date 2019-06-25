import { GenericResult } from '../GenericResult';
import { Result } from '../Result';

describe('GenericResult', () => {
  const genericResult = new GenericResult<string>('test');

  it('should return true for IsSuccess if there are no errors', () => {
    expect(genericResult.IsSuccess).toBeTruthy();
  });

  it('should return false for IsSuccess if there are errors', () => {
    genericResult.ErrorMessages.push('test');
    expect(genericResult.IsSuccess).toBeFalsy();
  });

  it('should combine one result with another, returning a new combined result', () => {
    const result1 = new Result();
    const result2 = new Result();
    result2.ErrorMessages.push('some error');

    const combinedResult = result1.CombineWith(result2);

    expect(combinedResult.IsSuccess).toBeFalsy();
  });
});
