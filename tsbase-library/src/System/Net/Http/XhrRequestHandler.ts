/**
 * Abstracts interactions between an HttpClient and JavaScript's XHR apis.
 */

import { HttpClient } from './HttpClient';
import { HttpResponseMessage } from './HttpResponseMessage';
import { HttpMethod } from '../HttpMethod';
import { IXhrRequestHandler } from './IXhrRequestHandler';

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

  private setRequestHeaders(xhr: XMLHttpRequest): void {
    this.httpClient.DefaultRequestHeaders.forEach(element => {
      xhr.setRequestHeader(element.key, element.value);
    });
  }
}