/**
 * An abstraction of the result of an action or command -
 * Use this pattern to return meaningful results from operations
 * that may have otherwise been void.
 */
export class Result {
  /**
   * Indicates whether or not the action returning the result was successful -
   * The lack of errors indicates success. The presence of errors indicates failure.
   */
  public get IsSuccess(): boolean {
    return this.ErrorMessages.length === 0;
  }

  /**
   * Messages indicating why the action returning the result was not successful
   */
  public ErrorMessages = Array<string>();

  /**
   * Returns a new result containing errors from this result instance as well as the one passed
   * @param result
   */
  public CombineWith(result: Result): Result {
    const newResult = new Result();
    newResult.ErrorMessages = this.ErrorMessages.concat(result.ErrorMessages);
    return newResult;
  }

  /**
   * Adds an error to ErrorMessages only when that error is not already present in the collection
   * @param error
   */
  public AddError(error: string): void {
    if (this.ErrorMessages.indexOf(error) === -1) {
      this.ErrorMessages.push(error);
    }
  }
}
