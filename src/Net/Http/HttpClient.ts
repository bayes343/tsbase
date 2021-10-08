import { Strings } from '../../System/Strings';
import { HttpResponseMessage } from './HttpResponseMessage';
import { HttpMethod } from '../HttpMethod';
import { IXhrRequestHandler } from './XhrRequestHandler/IXhrRequestHandler';
import { HttpRequestMessage } from './HttpRequestMessage';
import { BrowserXhrRequestHandler } from './XhrRequestHandler/BrowserXhrRequestHandler';
import { IHttpClient } from './IHttpClient';

export class HttpClient implements IHttpClient {
  public BaseAddress = Strings.Empty;
  public DefaultRequestHeaders: Record<string, string> = {};
  public Timeout = 10;

  private xhrRequestHandler: IXhrRequestHandler;

  /**
   * @param xhrRequestHandler optional parameter used for dependency injection
   */
  constructor(xhrRequestHandler?: IXhrRequestHandler) {
    this.xhrRequestHandler = xhrRequestHandler ? xhrRequestHandler : new BrowserXhrRequestHandler(this);
  }

  public CancelPendingRequests(): void {
    this.xhrRequestHandler.AbortPendingRequests();
  }

  public async DeleteAsync(uri: string): Promise<HttpResponseMessage> {
    uri = this.getFullUri(uri);
    const response = await this.xhrRequestHandler.SendXhrRequest(uri, HttpMethod.DELETE);
    return response;
  }

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

  public async SendAsync(httpRequestMessage: HttpRequestMessage): Promise<HttpResponseMessage> {
    httpRequestMessage.RequestUri = this.getFullUri(httpRequestMessage.RequestUri);
    const response = await this.xhrRequestHandler.SendXhrRequestMessage(httpRequestMessage);
    return response;
  }

  private getFullUri(uri: string): string {
    return this.BaseAddress ? `${this.BaseAddress}/${uri}` : uri;
  }
}
