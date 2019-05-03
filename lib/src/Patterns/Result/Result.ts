export class Result {
  public get IsSuccess(): boolean {
    return this.ErrorMessages.length === 0;
  }

  public ErrorMessages = Array<string>();
}
