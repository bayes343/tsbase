import { Strings } from '../../System/Strings';
import { HttpMethod } from '../HttpMethod';

/**
 * Abstracts an http request
 */
export class HttpRequestMessage {
  /**
   * String content to include in response body
   */
  public Content = Strings.Empty;
  /**
   * Additional headers to apply to this request when sent
   */
  public Headers: Record<string, string> = {};

  constructor(
    /**
     * Method to use when request is sent
     */
    public Method = HttpMethod.GET,
    /**
     * Http endpoint the request is targeting
     */
    public RequestUri = Strings.Empty
  ) { }
}
