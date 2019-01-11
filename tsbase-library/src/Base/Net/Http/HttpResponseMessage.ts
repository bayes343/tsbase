import { HttpStatusCode } from '../HttpStatusCode';

/**
 * Abstracts the response from an http request
 */
export class HttpResponseMessage {
  /**
   * Value set based on status code
   */
  public IsSuccessStatusCode = false;
  public Headers = new Array<{ name: string, value: string }>();

  constructor(
    /**
     * String response body 
     */
    public Content: string,
    public StatusCode: HttpStatusCode
  ) {
    this.IsSuccessStatusCode = this.StatusCode.Code < 400;
  }

  /**
   * Throws an exception if the response status code does not indicate success (>= 400)
   */
  public EnsureSuccessStatusCode(): void {
    if (!this.IsSuccessStatusCode) {
      throw new Error('Success code does not indicate success, and \"EnsureSuccessStatusCode\" was called.');
    }
  }
}