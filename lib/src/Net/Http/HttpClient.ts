import { HttpResponseMessage } from './HttpResponseMessage';
import { HttpMethod } from '../HttpMethod';
import { IXhrRequestHandler } from './IXhrRequestHandler';
import { KeyValue } from '../../TypeLiterals';
import { HttpRequestMessage } from './HttpRequestMessage';
import { BrowserXhrRequestHandler } from './XhrRequestHandler/BrowserXhrRequestHandler';
import { Strings } from '../../Constants/Strings';

export class HttpClient {
  /**
   * Gets or sets the base address of Uniform Resource Identifier (URI)
   * of the Internet resource used when sending requests.
   */
  public BaseAddress = Strings.Empty;
  /**
   * Gets the headers which should be sent with each request.
   */
  public DefaultRequestHeaders = new Array<KeyValue>();
  /**
   * Gets or sets the time in seconds to wait before the request times out.
   */
  public Timeout = 10;

  private xhrRequestHandler: IXhrRequestHandler;

  /**
   * @param xhrRequestHandler optional parameter used for dependency injection
   */
  constructor(xhrRequestHandler?: IXhrRequestHandler) {
    this.xhrRequestHandler = xhrRequestHandler ? xhrRequestHandler : new BrowserXhrRequestHandler(this);
  }

  /**
   * Cancel all pending requests on this instance.
   */
  public CancelPendingRequests(): void {
    this.xhrRequestHandler.AbortPendingRequests();
  }

  /**
   * Send a DELETE request to the specified Uri as an asynchronous operation.
   * @param uri
   */
  public async DeleteAsync(uri: string): Promise<HttpResponseMessage> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.DELETE);
    return response;
  }

  /**
   * Send a GET request to the specified Uri as an asynchronous operation.
   * @param uri
   */
  public async GetAsync(uri: string): Promise<HttpResponseMessage> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.GET);
    return response;
  }

  /**
   * Send a GET request to the specified Uri as an asynchronous operation
   * and have the response body returned as a string.
   * @param uri
   */
  public async GetStringAsync(uri: string): Promise<string> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.GET);
    return response.Content;
  }

  /**
   * Send a PATCH request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param payload
   */
  public async PatchAsync(uri: string, payload: any): Promise<HttpResponseMessage> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.PATCH, payload);
    return response;
  }

  /**
   * Send a POST request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param payload
   */
  public async PostAsync(uri: string, payload: any): Promise<HttpResponseMessage> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.POST, payload);
    return response;
  }

  /**
   * Send a PUT request to the specified Uri as an asynchronous operation.
   * @param uri
   * @param payload
   */
  public async PutAsync(uri: string, payload: any): Promise<HttpResponseMessage> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.PUT, payload);
    return response;
  }

  /**
   * Send an HTTP request as an asynchronous operation.
   * @param httpRequestMessage
   */
  public async SendAsync(httpRequestMessage: HttpRequestMessage): Promise<HttpResponseMessage> {
    httpRequestMessage.RequestUri = this.getFullUri(httpRequestMessage.RequestUri);
    const response = await this.xhrRequestHandler.SendXhrRequestMessage(httpRequestMessage);
    return response;
  }

  //#region Helpers
  private getFullUri(uri: string): string {
    return this.BaseAddress ? `${this.BaseAddress}/${uri}` : uri;
  }
  //#endregion
}
