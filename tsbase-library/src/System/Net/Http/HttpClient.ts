import { HttpResponseMessage } from './HttpResponseMessage';
import { HttpMethod } from '../HttpMethod';
import { IXhrRequestHandler } from './IXhrRequestHandler';
import { XhrRequestHandler } from './XhrRequestHandler';

export class HttpClient {
  /**
   * Gets or sets the base address of Uniform Resource Identifier (URI) of the Internet resource used when sending requests.
   */
  public BaseAddress = '';
  /**
   * Gets the headers which should be sent with each request.
   */
  public DefaultRequestHeaders = new Array<{ key: string, value: string }>();
  /**
   * Gets or sets the maximum number of bytes to buffer when reading the response content.
   */
  public MaxResponseContentBufferSize = 0;
  /**
   * Gets or sets the time in seconds to wait before the request times out.
   */
  public Timeout = 10;

  private xhrRequestHandler: IXhrRequestHandler;

  /**
   * @param xhrRequestHandler optional parameter used for dependency injection
   */
  constructor(xhrRequestHandler?: IXhrRequestHandler) {
    this.xhrRequestHandler = xhrRequestHandler ? xhrRequestHandler : new XhrRequestHandler(this);
  }

  public CancelPendingRequests() {
    this.xhrRequestHandler.AbortPendingRequests();
  }

  public async DeleteAsync(uri: string): Promise<HttpResponseMessage> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.DELETE);
    return response;
  }

  public Dispose() {
    throw new Error('Dispose not yet implemented');
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

  public async GetStringAsync(uri: string): Promise<string> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.GET);
    return response.Content;
  }

  public async PatchAsync(uri: string, payload: any): Promise<HttpResponseMessage> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.PATCH, payload);
    return response;
  }

  public async PostAsync(uri: string, payload: any): Promise<HttpResponseMessage> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.POST, payload);
    return response;
  }

  public async PutAsync(uri: string, payload: any): Promise<HttpResponseMessage> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.PUT, payload);
    return response;
  }

  public SendAsync() {
    throw new Error('SendAsync not yet implemented');
  }

  private getFullUri(uri: string): string {
    return this.BaseAddress ? `${this.BaseAddress}/${uri}` : uri;
  }
}