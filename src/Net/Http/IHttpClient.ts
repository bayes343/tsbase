import { HttpMethod } from './HttpMethod';

export type RestResponse<T> = {
  ok: boolean,
  status: number,
  statusText: string,
  body: string | T,
  headers: Headers
};

export interface IHttpClient {
  /**
   * An operation to be performed just after a response is resolved from a request,
   * but prior to the response being returned.
   */
  OnResponseResolved?: (response: Response) => void;

  /**
   * Gets the headers which should be sent with each request.
   */
  DefaultRequestHeaders: Record<string, string>;

  /**
   *
   * @param uri
   * @param method
   * @param body
   * @param additionalHeaders
   */
  Request(uri: string, method: HttpMethod, body?: string, additionalHeaders?: Record<string, string>): Promise<Response>;

  /**
   * Send a GET request to the specified Uri as an asynchronous operation.
   * @param uri
   */
  Get<T>(uri: string, additionalHeaders?: Record<string, string>): Promise<RestResponse<T>>;

  /**
   * Send a PATCH request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param body
   */
  Patch<T>(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<RestResponse<T>>;

  /**
   * Send a POST request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param body
   */
  Post<T>(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<RestResponse<T>>;

  /**
   * Send a PUT request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param body
   */
  Put<T>(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<RestResponse<T>>;

  /**
   * Send a DELETE request to the specified Uri as an asynchronous operation.
   * @param uri
   */
  Delete<T>(uri: string, additionalHeaders?: Record<string, string>): Promise<RestResponse<T>>;
}
