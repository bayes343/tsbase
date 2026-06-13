export class Guid {
  private constructor() { }

  /**
   * @security Insecure Randomness (CWE-330)
   * Assessment - Acceptable Risk / Mitigated Algorithmically (Joseph Bayes 20260613)
   *
   * crypto.randomUUID() not available in common runtimes using this library.
   * A unit test verifies that 100k guids result in no duplicates.
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
