import { GenericResult } from '../GenericResult';
import { Result } from '../Result';

describe('GenericResult', () => {
  let genericResult = new GenericResult<string>('test');

  it('should be constructed without a value parameter', () => {
    genericResult = new GenericResult<string>();
    expect(genericResult).toBeDefined();
  });

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

  it('should add error when the error is not already added', () => {
    const error = 'error';
    const result = new Result();

    result.AddError(error);

    expect(result.ErrorMessages.indexOf(error) >= 0).toBeTruthy();
    expect(result.ErrorMessages.length).toEqual(1);
  });

  it('should not add error when the error is already added', () => {
    const error = 'error';
    const result = new Result();
    result.AddError(error);

    result.AddError(error);

    expect(result.ErrorMessages.indexOf(error) >= 0).toBeTruthy();
    expect(result.ErrorMessages.length).toEqual(1);
  });
});
