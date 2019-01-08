import { HttpClient } from '../HttpClient';
import { HttpMethod } from '../../HttpMethod';
import { HttpResponseMessage } from '../HttpResponseMessage';
import { IXhrRequestHandler } from '../IXhrRequestHandler';

const BadRequest = new HttpResponseMessage('BadRequest', { Code: 400, Text: 'BadRequest' });
const OkRequest = new HttpResponseMessage('OK', { Code: 200, Text: 'OK' });

export class MockXhrRequestHandler implements IXhrRequestHandler {
  constructor(
    public httpClient: HttpClient
  ) { }

  public async SendXhrRequest(uri: string, method: HttpMethod, payload?: any): Promise<HttpResponseMessage> {
    return await new Promise<HttpResponseMessage>((resolve) => {
      switch (uri) {
        case 'https://fake.com/ok':
          resolve(OkRequest);
          break;
        case 'https://fake.com/bad':
          resolve(BadRequest);
        case 'https://fake.com/delete':
          resolve(OkRequest);
      }
    });
  }

  public AbortPendingRequests(): void {
    // mock response
  }
}
