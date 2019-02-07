import { XhrRequestHandler } from './XhrRequestHandler';

try {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
} catch (error) {
  // TODO: Prevents compilation error for browser builds
}

/**
 * An XhrRequestHandler implementation that works in node.js contexts
 */
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