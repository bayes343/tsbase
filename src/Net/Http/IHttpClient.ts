import { HttpResponseMessage } from './HttpResponseMessage';
import { HttpRequestMessage } from './HttpRequestMessage';

export interface IHttpClient {
  /**
   * Gets or sets the base address of Uniform Resource Identifier (URI)
   * of the Internet resource used when sending requests.
   */
  BaseAddress: string;
  /**
   * Gets the headers which should be sent with each request.
   */
  DefaultRequestHeaders: Record<string, string>;
  /**
   * Gets or sets the time in seconds to wait before the request times out.
   */
  Timeout: number;

  /**
   * Cancel all pending requests on this instance.
   */
  CancelPendingRequests(): void;

  /**
   * Send a DELETE request to the specified Uri as an asynchronous operation.
   * @param uri
   */
  DeleteAsync(uri: string): Promise<HttpResponseMessage>;

  /**
   * Send a GET request to the specified Uri as an asynchronous operation.
   * @param uri
   */
  GetAsync(uri: string): Promise<HttpResponseMessage>;

  /**
   * Send a GET request to the specified Uri as an asynchronous operation
   * and have the response body returned as a string.
   * @param uri
   */
  GetStringAsync(uri: string): Promise<string>;

  /**
   * Send a PATCH request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param payload
   */
  PatchAsync(uri: string, payload: any): Promise<HttpResponseMessage>;

  /**
   * Send a POST request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param payload
   */
  PostAsync(uri: string, payload: any): Promise<HttpResponseMessage>;

  /**
   * Send a PUT request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param payload
   */
  PutAsync(uri: string, payload: any): Promise<HttpResponseMessage>;

  /**
   * Send an HTTP request as an asynchronous operation.
   * @param httpRequestMessage
   */
  SendAsync(httpRequestMessage: HttpRequestMessage): Promise<HttpResponseMessage>;
}
