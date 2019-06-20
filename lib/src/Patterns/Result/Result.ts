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
}
