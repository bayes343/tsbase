import { HttpClient } from '../HttpClient';
import { HttpMethod } from '../../HttpMethod';
import { HttpResponseMessage } from '../HttpResponseMessage';
import { IXhrRequestHandler } from '../IXhrRequestHandler';
import { HttpRequestMessage } from '../HttpRequestMessage';

const BadRequest = new HttpResponseMessage('BadRequest', { Code: 400, Text: 'BadRequest' });
const OkRequest = new HttpResponseMessage('OK', { Code: 200, Text: 'OK' });

export class MockXhrRequestHandler implements IXhrRequestHandler {
  constructor(
    public httpClient: HttpClient
  ) { }

  public async SendXhrRequest(uri: string, _method: HttpMethod, _payload?: any): Promise<HttpResponseMessage> {
    return await new Promise<HttpResponseMessage>((resolve) => {
      switch (uri) {
        case 'https://fake.com/ok':
          resolve(OkRequest);
          break;
        case 'https://fake.com/bad':
          resolve(BadRequest);
          break;
        case 'https://fake.com/delete':
          resolve(OkRequest);
          break;
        default:
          break;
      }
    });
  }

  public async SendXhrRequestMessage(requestMessage: HttpRequestMessage): Promise<HttpResponseMessage> {
    return await new Promise<HttpResponseMessage>((resolve) => {
      switch (requestMessage.RequestUri) {
        case 'https://fake.com/ok':
          resolve(OkRequest);
          break;
        case 'https://fake.com/bad':
          resolve(BadRequest);
          break;
        case 'https://fake.com/delete':
          resolve(OkRequest);
          break;
        default:
          break;
      }
    });
  }

  public AbortPendingRequests(): void {
    // mock response
  }
}
