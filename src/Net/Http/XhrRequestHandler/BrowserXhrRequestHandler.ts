import { XhrRequestHandler } from './XhrRequestHandler';
import { IXhrRequestHandler } from '../IXhrRequestHandler';
import { Errors } from '../../../Errors';

/**
 * An XhrRequestHandler implementation that works in browser contexts
 */
export class BrowserXhrRequestHandler extends XhrRequestHandler implements IXhrRequestHandler {
  GetXhrRequest(): XMLHttpRequest {
    if (!this.HttpClient) {
      throw new Error(Errors.NullHttpClient);
    }
    const xhr = new XMLHttpRequest();
    xhr.timeout = this.HttpClient.Timeout * 1000;
    this.xhrRequests.push(xhr);
    return xhr;
  }
}
