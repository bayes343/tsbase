import { HttpResponseMessage } from '../HttpResponseMessage';
import { HttpMethod } from '../../HttpMethod';
import { HttpRequestMessage } from '../HttpRequestMessage';

/**
 * Consumed by HttpClient - handles direct interaction with XHR api
 */
export interface IXhrRequestHandler {
  /**
   * Creates and resolves an http response given the passed parameters
   * @param uri
   * @param method
   * @param payload
   */
  SendXhrRequest(uri: string, method: HttpMethod, payload?: any): Promise<HttpResponseMessage>;
  /**
   * Creates and resolves an http response given the passed HttpResponseMessage
   * @param requestMessage
   */
  SendXhrRequestMessage(requestMessage: HttpRequestMessage): Promise<HttpResponseMessage>;
  /**
   * Handles aborting any pending xhr requests
   */
  AbortPendingRequests(): void;
}
