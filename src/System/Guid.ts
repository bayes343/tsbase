export class Guid {
  private constructor() { }

  /**
   * Returns a new globally unique identifier (GUID)
   */
  public static NewGuid(): string {
    return (this.S4() + this.S4() + '-' + this.S4() + '-4' + this.S4().substr(0, 3) + '-' +
      this.S4() + '-' + this.S4() + this.S4() + this.S4()).toLowerCase();
  }

  private static S4() {
    // eslint-disable-next-line no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
}
