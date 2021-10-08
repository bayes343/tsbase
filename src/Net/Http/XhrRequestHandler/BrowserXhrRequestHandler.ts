import { NullHttpClient, XhrRequestHandler } from './XhrRequestHandler';
import { IXhrRequestHandler } from './IXhrRequestHandler';
import { LogEntry, Logger, LogLevel } from '../../../Utility/Logger/module';

/**
 * An XhrRequestHandler implementation that works in browser contexts
 */
export class BrowserXhrRequestHandler extends XhrRequestHandler implements IXhrRequestHandler {
  GetXhrRequest(): XMLHttpRequest {
    if (!this.HttpClient) {
      const error = new Error(NullHttpClient);
      Logger.Instance.Log(new LogEntry(NullHttpClient, LogLevel.Error, error));
      throw error;
    }
    const xhr = new XMLHttpRequest();
    xhr.timeout = this.HttpClient.Timeout * 1000;
    this.xhrRequests.push(xhr);
    return xhr;
  }
}
