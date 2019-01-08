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

  public CancelPendingRequests() {
    throw new Error('CancelPendingRequests not yet implemented');
  }

  public DeleteAsync() {
    throw new Error('DeleteAsync not yet implemented');
  }

  public Dispose() {
    throw new Error('Dispose not yet implemented');
  }

  /**
   * 
   * @param xhrRequestHandler optional parameter used for dependency injection
   */
  constructor(xhrRequestHandler?: IXhrRequestHandler) {
    this.xhrRequestHandler = xhrRequestHandler ? xhrRequestHandler : new XhrRequestHandler(this);
  }

  /**
   * Send a GET request to the specified Uri as an asynchronous operation.
   * @param uri 
   */
  public async GetAsync(uri: string): Promise<HttpResponseMessage> {
    uri = this.BaseAddress ? `${this.BaseAddress}/${uri}` : uri;
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.GET);
    return response;
  }

  public GetByteArrayAsync() {
    throw new Error('GetByteArrayAsync not yet implemented');
  }

  public GetStreamAsync() {
    throw new Error('GetStreamAsync not yet implemented');
  }

  public GetStringAsync() {
    throw new Error('GetStringAsync not yet implemented');
  }

  public PatchAsync() {
    throw new Error('PatchAsync not yet implemented');
  }

  public PostAsync() {
    throw new Error('PostAsync not yet implemented');
  }

  public PutAsync() {
    throw new Error('PutAsync not yet implemented');
  }

  public SendAsync() {
    throw new Error('SendAsync not yet implemented');
  }
}