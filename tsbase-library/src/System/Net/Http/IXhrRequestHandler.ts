import { HttpResponseMessage } from './HttpResponseMessage';
import { HttpMethod } from '../HttpMethod';
import { HttpRequestMessage } from './HttpRequestMessage';

export interface IXhrRequestHandler {
  SendXhrRequest(uri: string, method: HttpMethod, payload?: any): Promise<HttpResponseMessage>;
  SendXhrRequestMessage(requestMessage: HttpRequestMessage): Promise<HttpResponseMessage>;
  AbortPendingRequests(): void;
}