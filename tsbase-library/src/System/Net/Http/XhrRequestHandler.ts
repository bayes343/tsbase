/**
 * Abstracts interactions between an HttpClient and JavaScript's XHR apis.
 */

import { HttpClient } from './HttpClient';
import { HttpResponseMessage } from './HttpResponseMessage';
import { HttpMethod } from '../HttpMethod';
import { IXhrRequestHandler } from './IXhrRequestHandler';
import { HttpRequestMessage } from './HttpRequestMessage';
import { KeyValue } from '../../TypeLiterals';

const BadRequest = new HttpResponseMessage('BadRequest is sent when no other error is applicable, or if the exact error is unknown or does not have its own error code.', { Code: 400, Text: 'BadRequest' });

export class XhrRequestHandler implements IXhrRequestHandler {
  private httpClient: HttpClient;
  private xhrRequests = new Array<XMLHttpRequest>();

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public async SendXhrRequest(uri: string, method: HttpMethod, payload?: any): Promise<HttpResponseMessage> {
    return await new Promise<HttpResponseMessage>((resolve) => {
      const xhr = this.getXhrRequest();
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
      const xhr = this.getXhrRequest();
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

  private getXhrRequest(): XMLHttpRequest {
    var xhr = new XMLHttpRequest();
    xhr.timeout = this.httpClient.Timeout * 1000;
    this.xhrRequests.push(xhr);
    return xhr;
  }

  private setRequestHeaders(xhr: XMLHttpRequest, additionalHeaders?: Array<KeyValue>): void {
    this.httpClient.DefaultRequestHeaders.forEach(element => {
      xhr.setRequestHeader(element.key, element.value);
    });
    if (additionalHeaders) {
      additionalHeaders.forEach(element => {
        xhr.setRequestHeader(element.key, element.value);
      });
    }
  }
}