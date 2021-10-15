import { HttpMethod } from './HttpMethod';

export type RestResponse = {
  ok: boolean,
  status: number,
  statusText: string,
  body: string | object,
  headers: Headers
};

export interface IHttpClient {
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
  Get(uri: string, additionalHeaders?: Record<string, string>): Promise<RestResponse>;

  /**
   * Send a PATCH request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param body
   */
  Patch(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<RestResponse>;

  /**
   * Send a POST request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param body
   */
  Post(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<RestResponse>;

  /**
   * Send a PUT request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param body
   */
  Put(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<RestResponse>;

  /**
   * Send a DELETE request to the specified Uri as an asynchronous operation.
   * @param uri
   */
  Delete(uri: string, additionalHeaders?: Record<string, string>): Promise<RestResponse>;
}
