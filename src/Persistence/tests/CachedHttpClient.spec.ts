import { CachedHttpClient } from '../CachedHttpClient';
import { HttpClient } from '../../Net/Http/HttpClient';
import { HttpResponseMessage } from '../../Net/Http/HttpResponseMessage';
import { HttpMethod } from '../../Net/HttpMethod';
import { Mock } from 'tsmockit';
import { IXhrRequestHandler } from '../../Net/Http/IXhrRequestHandler';
import { Strings } from '../../Constants/Strings';

describe('CachedHttpClient', () => {
  const OkRequest = new HttpResponseMessage('OK', { Code: 200, Text: 'OK' });
  const mockXhrRequestHandler = new Mock<IXhrRequestHandler>();
  let classUnderTest: CachedHttpClient;
  let httpClient: HttpClient;

  beforeEach(() => {
    // tslint:disable-next-line: promise-function-async
    mockXhrRequestHandler.Setup(x => x.SendXhrRequest('https://fake.com/ok', HttpMethod.GET, Strings.Empty),
      new Promise<HttpResponseMessage>((resolve) => { resolve(OkRequest); }));
    httpClient = new HttpClient(mockXhrRequestHandler.Object);
    classUnderTest = new CachedHttpClient(httpClient);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should get async fresh and stale content', async () => {
    const response1 = await classUnderTest.GetAsync('https://fake.com/ok');
    expect(response1.StatusCode.Code).toEqual(200);

    const response2 = await classUnderTest.GetAsync('https://fake.com/ok');
    expect(response1 === response2).toBeTruthy();

    const response3 = await classUnderTest.GetAsync('https://fake.com/ok', true);
    expect(response3 === response2);
  });

});
