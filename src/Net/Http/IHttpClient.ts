export interface IHttpClient {
  /**
   * Gets the headers which should be sent with each request.
   */
  DefaultRequestHeaders: Record<string, string>;

  /**
   * Send a GET request to the specified Uri as an asynchronous operation.
   * @param uri
   */
  GetAsync(uri: string, additionalHeaders?: Record<string, string>): Promise<Response>;

  /**
   * Send a PATCH request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param body
   */
  PatchAsync(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<Response>;

  /**
   * Send a POST request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param body
   */
  PostAsync(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<Response>;

  /**
   * Send a PUT request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param body
   */
  PutAsync(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<Response>;

  /**
   * Send a DELETE request to the specified Uri as an asynchronous operation.
   * @param uri
   */
  DeleteAsync(uri: string, additionalHeaders?: Record<string, string>): Promise<Response>;

  /**
   * Send a GET request to the specified Uri as an asynchronous operation
   * and have the response body returned as a string.
   * @param uri
   */
  GetStringAsync(uri: string, additionalHeaders?: Record<string, string>): Promise<string>;
}
