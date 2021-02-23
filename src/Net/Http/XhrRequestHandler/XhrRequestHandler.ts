
import { HttpClient } from '../HttpClient';
import { HttpResponseMessage } from '../HttpResponseMessage';
import { HttpMethod } from '../../HttpMethod';
import { HttpRequestMessage } from '../HttpRequestMessage';
import { KeyValue } from '../../../TypeLiterals';
import { IXhrRequestHandler } from '../IXhrRequestHandler';
import { Errors } from '../../../Errors';
import { LogEntry, Logger, LogLevel } from '../../../Utility/Logger/module';

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

  private setRequestHeaders(xhr: XMLHttpRequest, additionalHeaders?: Array<KeyValue>): void {
    if (!this.HttpClient) {
      const error = new Error(Errors.NullHttpClient);
      Logger.Instance.Log(new LogEntry(Errors.Base64DecodingFailed, LogLevel.Error, error));
      throw error;
    }
    this.HttpClient.DefaultRequestHeaders.forEach(element => {
      xhr.setRequestHeader(element.key, element.value);
    });
    if (additionalHeaders) {
      additionalHeaders.forEach(element => {
        xhr.setRequestHeader(element.key, element.value);
      });
    }
  }
}
