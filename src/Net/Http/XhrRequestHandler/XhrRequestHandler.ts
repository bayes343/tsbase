
import { HttpClient } from '../HttpClient';
import { HttpResponseMessage } from '../HttpResponseMessage';
import { HttpMethod } from '../../HttpMethod';
import { HttpRequestMessage } from '../HttpRequestMessage';
import { IXhrRequestHandler } from './IXhrRequestHandler';
import { LogEntry, Logger, LogLevel } from '../../../Utility/Logger/module';

export const BadStatusCode = 'BadStatusCode';
export const NullHttpClient = 'NullHttpClient - If overriding the default XhrRequestHandler, ensure that you set the \
HttpClient property to the HttpClient instance the handler belongs to.';

const BadRequest = new HttpResponseMessage(
  'BadRequest is sent when no other error is applicable, or if the exact error is unknown or does not have \
  its own error code.', { Code: 400, Text: 'BadRequest' });

/**
 * Base class for an object that implements IXhrRequestHandler - descendants implement xhr object creation.
 */
export abstract class XhrRequestHandler implements IXhrRequestHandler {
  protected xhrRequests = new Array<XMLHttpRequest>();

  constructor(
    public HttpClient?: HttpClient
  ) { }

  protected abstract GetXhrRequest(): XMLHttpRequest;

  public async SendXhrRequest(uri: string, method: HttpMethod, payload?: any): Promise<HttpResponseMessage> {
    return await new Promise<HttpResponseMessage>((resolve) => {
      const xhr = this.GetXhrRequest();
      xhr.open(method, uri, true);
      this.setRequestHeaders(xhr);
      xhr.onload = () => resolve(
        new HttpResponseMessage(xhr.responseText, { Code: xhr.status, Text: xhr.statusText })
      );
      xhr.onerror = () => resolve(BadRequest);
      xhr.send(payload ? JSON.stringify(payload) : null);
    });
  }

  public async SendXhrRequestMessage(requestMessage: HttpRequestMessage): Promise<HttpResponseMessage> {
    return await new Promise<HttpResponseMessage>((resolve) => {
      const xhr = this.GetXhrRequest();
      xhr.open(requestMessage.Method, requestMessage.RequestUri, true);
      this.setRequestHeaders(xhr, requestMessage.Headers);
      xhr.onload = () => resolve(
        new HttpResponseMessage(xhr.responseText, { Code: xhr.status, Text: xhr.statusText })
      );
      xhr.onerror = () => resolve(BadRequest);
      xhr.send(requestMessage.Content ? requestMessage.Content : null);
    });
  }

  public AbortPendingRequests(): void {
    this.xhrRequests.forEach(element => {
      element.abort();
    });
  }

  private setRequestHeaders(xhr: XMLHttpRequest, additionalHeaders?: Record<string, string>): void {
    if (!this.HttpClient) {
      const error = new Error(NullHttpClient);
      Logger.Instance.Log(new LogEntry(NullHttpClient, LogLevel.Error, error));
      throw error;
    }

    for (const key in this.HttpClient.DefaultRequestHeaders) {
      const value = this.HttpClient.DefaultRequestHeaders[key];
      xhr.setRequestHeader(key, value);
    }

    if (additionalHeaders) {
      for (const key in additionalHeaders) {
        const value = additionalHeaders[key];
        xhr.setRequestHeader(key, value);
      }
    }
  }
}
