import { CachedHttpClient } from '../CachedHttpClient';
import { HttpClient } from '../../Net/Http/HttpClient';
import { MockXhrRequestHandler } from '../../Net/Http/tests/MockXhrRequestHandler';

describe('CachedHttpClient', () => {
  let classUnderTest: CachedHttpClient;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient(new MockXhrRequestHandler(httpClient));
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
