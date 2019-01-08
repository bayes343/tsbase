import { XhrRequestHandler } from './XhrRequestHandler';

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export class NodeXhrRequestHandler extends XhrRequestHandler {
  GetXhrRequest(): XMLHttpRequest {
    if (!this.HttpClient) {
      throw new Error('HttpClient is undefined');
    }
    var xhr = new XMLHttpRequest();
    xhr.timeout = this.HttpClient.Timeout * 1000;
    this.xhrRequests.push(xhr);
    return xhr;
  }
}