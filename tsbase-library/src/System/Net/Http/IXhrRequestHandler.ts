import { HttpResponseMessage } from './HttpResponseMessage';
import { HttpMethod } from '../HttpMethod';

export interface IXhrRequestHandler {
  SendXhrRequest(uri: string, method: HttpMethod, payload?: any): Promise<HttpResponseMessage>;
  AbortPendingRequests(): void;
}