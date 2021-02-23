import { XhrRequestHandler } from './XhrRequestHandler';
import { IXhrRequestHandler } from '../IXhrRequestHandler';
import { Errors } from '../../../Errors';
import { LogEntry, Logger, LogLevel } from '../../../Utility/Logger/module';

/**
 * An XhrRequestHandler implementation that works in browser contexts
 */
export class BrowserXhrRequestHandler extends XhrRequestHandler implements IXhrRequestHandler {
  GetXhrRequest(): XMLHttpRequest {
    if (!this.HttpClient) {
      const error = new Error(Errors.NullHttpClient);
      Logger.Instance.Log(new LogEntry(Errors.Base64DecodingFailed, LogLevel.Error, error));
      throw error;
    }
    const xhr = new XMLHttpRequest();
    xhr.timeout = this.HttpClient.Timeout * 1000;
    this.xhrRequests.push(xhr);
    return xhr;
  }
}
