import { KeyValue } from '../../TypeLiterals';
import { HttpStatusCode } from '../HttpStatusCode';
import { LogEntry, Logger, LogLevel } from '../../Utility/Logger/module';
import { BadStatusCode } from './XhrRequestHandler/XhrRequestHandler';

/**
 * Abstracts the response from an http request
 */
export class HttpResponseMessage {
  /**
   * Value set based on status code
   */
  public IsSuccessStatusCode = false;

  /**
   * Headers returned by the server responding to the request
   */
  public Headers = new Array<KeyValue>();

  constructor(
    /**
     * String response body
     */
    public Content: string,
    /**
     * The http status code and corresponding description returned by the server
     */
    public StatusCode: HttpStatusCode
  ) {
    this.IsSuccessStatusCode = this.StatusCode.Code < 400;
  }

  /**
   * Throws an exception if the response status code does not indicate success (>= 400)
   */
  public EnsureSuccessStatusCode(): void {
    if (!this.IsSuccessStatusCode) {
      const error = new Error(
        `${BadStatusCode} - Status code does not indicate success, and \"EnsureSuccessStatusCode\" was called.`);
      Logger.Instance.Log(new LogEntry(BadStatusCode, LogLevel.Error, error));
      throw error;
    }
  }
}
